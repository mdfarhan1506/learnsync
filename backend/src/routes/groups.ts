import { Router, Request, Response } from 'express';
import { mockAI } from '../ai/mockAI';
import prisma from '../lib/prisma';

const router = Router();

// List groups for a class
router.get('/class/:classId', async (req: Request, res: Response) => {
  try {
    const groups = await prisma.learningGroup.findMany({
      where: { classId: req.params.classId as string, status: 'active' },
      include: {
        members: { include: { student: { include: { profile: { include: { skills: { include: { skill: true } } } } } } } },
        interventions: { include: { activities: true, quickChecks: { include: { results: true } } } }
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(groups);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all groups (optionally filtered)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;
    const groups = await prisma.learningGroup.findMany({
      where: classId ? { classId: classId as string, status: 'active' } : { status: 'active' },
      include: {
        members: { include: { student: true } },
        interventions: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(groups);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single group
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const group = await prisma.learningGroup.findUnique({
      where: { id: req.params.id as string },
      include: {
        members: {
          include: {
            student: {
              include: {
                profile: { include: { skills: { include: { skill: true } } } },
                observations: true
              }
            }
          }
        },
        interventions: {
          include: {
            activities: true,
            quickChecks: { include: { results: { include: { student: true } } } },
            skill: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!group) return res.status(404).json({ error: 'Not found' });
    res.json(group);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate intervention for a group
router.post('/:id/generate-intervention', async (req: Request, res: Response) => {
  try {
    const group = await prisma.learningGroup.findUnique({
      where: { id: req.params.id as string },
      include: { members: { include: { student: { include: { profile: true } } } } }
    });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const skill = await prisma.skill.findUnique({ where: { id: group.primarySkillId } });
    const durationMins = req.body.durationMins || 10;

    // Generate AI intervention content
    const activityContent = await mockAI.generateIntervention(
      group.primarySkillName || 'Core Skills',
      group.avgMasteryPct,
      'Grade 5',
      durationMins
    );

    // Generate activities for other groups in same class
    const otherGroups = await prisma.learningGroup.findMany({
      where: { classId: group.classId, id: { not: group.id }, status: 'active' }
    });
    const otherActivities = await mockAI.generateOtherActivities(
      otherGroups.map(g => ({ type: g.type, primarySkillName: g.primarySkillName }))
    );

    // Create intervention record
    const intervention = await prisma.intervention.create({
      data: {
        groupId: group.id,
        skillId: group.primarySkillId || (skill?.id ?? ''),
        title: activityContent.title,
        durationMins,
        status: 'planned',
        isAiGenerated: true,
        activities: {
          create: [
            {
              targetGroup: 'intervention',
              title: activityContent.title,
              objective: activityContent.objective,
              materials: activityContent.materials,
              steps: activityContent.steps,
              examples: activityContent.examples,
              differentiation: activityContent.differentiation,
              isAiGenerated: true,
              isApproved: false
            },
            ...otherActivities.map(a => ({
              targetGroup: a.targetGroup,
              title: a.title,
              objective: a.objective,
              materials: a.materials,
              steps: a.steps,
              isAiGenerated: true,
              isApproved: false
            }))
          ]
        }
      },
      include: { activities: true }
    });

    res.json(intervention);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start intervention
router.post('/:groupId/interventions/:interventionId/start', async (req: Request, res: Response) => {
  try {
    const updated = await prisma.intervention.update({
      where: { id: req.params.interventionId as string },
      data: { status: 'active', startedAt: new Date() }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Complete intervention
router.post('/:groupId/interventions/:interventionId/complete', async (req: Request, res: Response) => {
  try {
    const updated = await prisma.intervention.update({
      where: { id: req.params.interventionId as string },
      data: { status: 'completed', completedAt: new Date() }
    });

    // Generate quick check questions
    const group = await prisma.learningGroup.findUnique({ where: { id: req.params.groupId as string } });
    const quickCheckQs = await mockAI.generateQuickCheckQuestions(
      group?.primarySkillName || 'Core Skills', 3
    );

    const quickCheck = await prisma.quickCheck.create({
      data: {
        interventionId: req.params.interventionId as string,
        questions: JSON.stringify(quickCheckQs),
        status: 'pending'
      }
    });

    res.json({ intervention: updated, quickCheck });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Teacher override (move/add/remove student)
router.post('/:id/override', async (req: Request, res: Response) => {
  try {
    const { studentId, action, reason, teacherId, targetGroupId } = req.body;

    // Log the override
    const override = await prisma.groupOverride.create({
      data: { groupId: req.params.id as string, studentId, action, reason: reason || '', teacherId }
    });

    if (action === 'remove') {
      await prisma.learningGroupMember.deleteMany({
        where: { groupId: req.params.id as string, studentId }
      });
    } else if (action === 'add') {
      await prisma.learningGroupMember.upsert({
        where: { id: `${req.params.id as string}-${studentId}` },
        update: { isManualOverride: true },
        create: { groupId: req.params.id as string, studentId, isManualOverride: true }
      });
    } else if (action === 'move' && targetGroupId) {
      await prisma.learningGroupMember.deleteMany({
        where: { groupId: req.params.id as string, studentId }
      });
      await prisma.learningGroupMember.create({
        data: { groupId: targetGroupId, studentId, isManualOverride: true }
      });
    }

    res.json({ success: true, override });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Recalculate groups for a class
router.post('/class/:classId/recalculate', async (req: Request, res: Response) => {
  try {
    // Archive existing groups
    await prisma.learningGroup.updateMany({
      where: { classId: req.params.classId as string, status: 'active' },
      data: { status: 'archived' }
    });

    // Get all student profiles with skill data
    const students = await prisma.student.findMany({
      where: { classId: req.params.classId as string },
      include: { profile: { include: { skills: { include: { skill: true } } } } }
    });

    const rules = await prisma.assessmentRule.findUnique({ where: { classId: req.params.classId as string } });
    const masteredMin = rules?.masteredMin ?? 80;
    const developingMin = rules?.developingMin ?? 50;

    const needsRegrouping = students.filter(s => s.profile?.primaryGap === 'Addition/Subtraction Regrouping');
    const needsDivision = students.filter(s => s.profile?.primaryGap === 'Division Facts');
    const onTrack = students.filter(s => s.profile?.overallStatus === 'developing');
    const advanced = students.filter(s => s.profile?.overallStatus === 'advanced');

    const newGroups = [];

    if (needsRegrouping.length > 0) {
      const g = await prisma.learningGroup.create({
        data: {
          classId: req.params.classId as string,
          name: 'Regrouping Intervention',
          type: 'intervention',
          primarySkillName: 'Addition/Subtraction Regrouping',
          avgMasteryPct: 32,
          whyExplanation: `${needsRegrouping.length} students scored below ${masteredMin}% on Regrouping questions and share this as their primary skill gap.`,
          recommendedAction: 'Targeted 10-minute regrouping intervention with base-ten blocks.',
          colorCode: 'red',
          status: 'active'
        }
      });
      for (const s of needsRegrouping) {
        await prisma.learningGroupMember.create({ data: { groupId: g.id, studentId: s.id } });
      }
      newGroups.push(g);
    }

    if (needsDivision.length > 0) {
      const g = await prisma.learningGroup.create({
        data: {
          classId: req.params.classId as string,
          name: 'Division Facts Intervention',
          type: 'intervention',
          primarySkillName: 'Division Facts',
          avgMasteryPct: 28,
          whyExplanation: `${needsDivision.length} students scored below ${masteredMin}% on Division Facts and may have a prerequisite gap in Multiplication Facts.`,
          recommendedAction: 'Fluency games connecting multiplication and division fact families.',
          colorCode: 'orange',
          status: 'active'
        }
      });
      for (const s of needsDivision) {
        await prisma.learningGroupMember.create({ data: { groupId: g.id, studentId: s.id } });
      }
      newGroups.push(g);
    }

    if (onTrack.length > 0) {
      const g = await prisma.learningGroup.create({
        data: {
          classId: req.params.classId as string,
          name: 'On Track — Core Practice',
          type: 'on_track',
          primarySkillName: '',
          avgMasteryPct: 68,
          whyExplanation: `${onTrack.length} students are developing across multiple skills and are ready for standard curriculum practice.`,
          recommendedAction: 'Independent practice from textbook pages 45–52.',
          colorCode: 'blue',
          status: 'active'
        }
      });
      for (const s of onTrack) {
        await prisma.learningGroupMember.create({ data: { groupId: g.id, studentId: s.id } });
      }
      newGroups.push(g);
    }

    if (advanced.length > 0) {
      const g = await prisma.learningGroup.create({
        data: {
          classId: req.params.classId as string,
          name: 'Advanced — Enrichment',
          type: 'advanced',
          primarySkillName: '',
          avgMasteryPct: 94,
          whyExplanation: `${advanced.length} students demonstrated mastery across all assessed skills and are ready for extension activities.`,
          recommendedAction: 'Challenge word problems and multi-step equations.',
          colorCode: 'green',
          status: 'active'
        }
      });
      for (const s of advanced) {
        await prisma.learningGroupMember.create({ data: { groupId: g.id, studentId: s.id } });
      }
      newGroups.push(g);
    }

    res.json({ success: true, groupsCreated: newGroups.length, groups: newGroups });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
