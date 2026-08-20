import { Router } from 'express';
import { mockAI } from '../ai/mockAI';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  const classId = req.query.classId as string | undefined;
  try {
    const assessments = classId
      ? await prisma.assessment.findMany({
          where: { classId },
          include: { questions: { include: { skillMappings: { include: { skill: true } } } }, submissions: true },
          orderBy: { createdAt: 'desc' }
        })
      : await prisma.assessment.findMany({
          include: { questions: true, submissions: true },
          orderBy: { createdAt: 'desc' }
        });
    res.json(assessments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: req.params.id as string },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
          include: { skillMappings: { include: { skill: true } } }
        },
        submissions: { include: { student: true } },
        topic: true
      }
    });
    if (!assessment) return res.status(404).json({ error: 'Not found' });
    res.json(assessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const code = req.body.classCode || Math.random().toString(36).substring(2, 8).toUpperCase();
    const newAssessment = await prisma.assessment.create({
      data: { ...req.body, classCode: code }
    });
    res.status(201).json(newAssessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await prisma.assessment.update({
      where: { id: req.params.id as string },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate AI questions for an assessment
router.post('/:id/generate-questions', async (req, res) => {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: req.params.id as string },
      include: { topic: { include: { skills: true } } }
    });
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

    const count = req.body.count || 5;
    const skill = req.body.skill || 'General';
    const difficulty = req.body.difficulty || assessment.difficulty;

    // Get skills for this topic for mapping
    const skills = assessment.topic?.skills || [];

    const generatedQs = await mockAI.generateQuestions(assessment.topic?.name || 'Math', skill, count, difficulty);

    const created = [];
    for (let i = 0; i < generatedQs.length; i++) {
      const q = generatedQs[i];
      const currentCount = await prisma.question.count({ where: { assessmentId: assessment.id } });
      const question = await prisma.question.create({
        data: {
          assessmentId: assessment.id,
          text: q.text,
          type: q.type,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          isAiGenerated: true,
          isApproved: false,
          orderIndex: currentCount + i
        }
      });

      // Map to first matching skill if available
      const matchingSkill = skills.find(s => s.name.toLowerCase().includes(skill.toLowerCase()));
      if (matchingSkill) {
        await prisma.questionSkillMapping.create({
          data: { questionId: question.id, skillId: matchingSkill.id, weight: 1.0 }
        });
      }

      created.push(question);
    }

    await prisma.assessment.update({
      where: { id: req.params.id as string },
      data: { status: 'review' }
    });

    res.json({ success: true, questions: created });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Approve a single question
router.post('/:id/questions/:qid/approve', async (req, res) => {
  try {
    const updated = await prisma.question.update({
      where: { id: req.params.qid as string },
      data: { isApproved: true }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Publish assessment (teacher approved)
router.post('/:id/publish', async (req, res) => {
  try {
    const updated = await prisma.assessment.update({
      where: { id: req.params.id as string },
      data: { status: 'published', publishedAt: new Date() }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Submit student results (digital mode)
router.post('/:id/submit-results', async (req, res) => {
  try {
    const { studentId, answers } = req.body;
    let totalScore = 0;
    const totalPossible = answers.length;

    const submission = await prisma.assessmentSubmission.create({
      data: {
        assessmentId: req.params.id as string,
        studentId,
        status: 'completed',
        submittedAt: new Date(),
        answers: {
          create: answers.map((a: any) => {
            const isCorrect = a.selectedAnswer === a.correctAnswer;
            if (isCorrect) totalScore++;
            return {
              questionId: a.questionId,
              studentId,
              selectedAnswer: a.selectedAnswer,
              isCorrect
            };
          })
        }
      }
    });

    await prisma.assessmentSubmission.update({
      where: { id: submission.id },
      data: {
        totalScore,
        totalPossible,
        percentScore: totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0
      }
    });

    res.json({ success: true, submissionId: submission.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get analysis / results for an assessment
router.get('/:id/analysis', async (req, res) => {
  try {
    const assessmentId = req.params.id as string;

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: { include: { skillMappings: { include: { skill: true } } } },
        submissions: {
          include: {
            student: true,
            answers: { include: { question: { include: { skillMappings: { include: { skill: true } } } } } }
          }
        }
      }
    });

    if (!assessment) return res.status(404).json({ error: 'Not found' });

    // Calculate skill-level summary across all students
    const skillSummary: Record<string, { skillName: string; mastered: number; developing: number; needs_support: number; totalMastery: number; count: number }> = {};

    for (const submission of assessment.submissions) {
      const skillStats: Record<string, { correct: number; total: number }> = {};

      for (const answer of submission.answers) {
        for (const sm of answer.question.skillMappings) {
          const sid = sm.skillId;
          if (!skillStats[sid]) skillStats[sid] = { correct: 0, total: 0 };
          skillStats[sid].total++;
          if (answer.isCorrect) skillStats[sid].correct++;
        }
      }

      // Get assessment rules for this class
      const rules = await prisma.assessmentRule.findUnique({ where: { classId: assessment.classId } });
      const masteredMin = rules?.masteredMin ?? 80;
      const developingMin = rules?.developingMin ?? 50;

      for (const [sid, stats] of Object.entries(skillStats)) {
        const pct = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
        const skill = assessment.questions
          .flatMap(q => q.skillMappings)
          .find(sm => sm.skillId === sid)?.skill;
        const skillName = skill?.name || sid;

        if (!skillSummary[sid]) {
          skillSummary[sid] = { skillName, mastered: 0, developing: 0, needs_support: 0, totalMastery: 0, count: 0 };
        }
        skillSummary[sid].count++;
        skillSummary[sid].totalMastery += pct;

        if (pct >= masteredMin) skillSummary[sid].mastered++;
        else if (pct >= developingMin) skillSummary[sid].developing++;
        else skillSummary[sid].needs_support++;
      }
    }

    const skillBreakdown = Object.entries(skillSummary).map(([sid, s]) => ({
      skillId: sid,
      skillName: s.skillName,
      mastered: s.mastered,
      developing: s.developing,
      needs_support: s.needs_support,
      avgMastery: s.count > 0 ? s.totalMastery / s.count : 0
    }));

    res.json({
      assessment: { id: assessment.id, title: assessment.title, status: assessment.status },
      totalStudents: assessment.submissions.length,
      avgScore: assessment.submissions.reduce((a, s) => a + s.percentScore, 0) / (assessment.submissions.length || 1),
      skillBreakdown,
      submissions: assessment.submissions.map(s => ({
        studentId: s.studentId,
        studentName: s.student.name,
        rollNumber: s.student.rollNumber,
        percentScore: s.percentScore,
        status: s.status
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
