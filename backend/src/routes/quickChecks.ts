import { Router, Request, Response } from 'express';
import { mockAI } from '../ai/mockAI';
import prisma from '../lib/prisma';

const router = Router();

// Submit quick check results for a group
router.post('/', async (req: Request, res: Response) => {
  try {
    const { interventionId, results } = req.body;
    // results: Array<{ studentId, status, score, notes }>

    const intervention = await prisma.intervention.findUnique({
      where: { id: interventionId },
      include: { group: true, skill: true }
    });
    if (!intervention) return res.status(404).json({ error: 'Intervention not found' });

    // Get or create a quick check
    let quickCheck = await prisma.quickCheck.findFirst({
      where: { interventionId, status: { not: 'completed' } }
    });

    const skill = intervention.skill?.name || 'Core Skills';
    const qs = await mockAI.generateQuickCheckQuestions(skill, 3);

    if (!quickCheck) {
      quickCheck = await prisma.quickCheck.create({
        data: {
          interventionId,
          questions: JSON.stringify(qs),
          status: 'active'
        }
      });
    }

    // Save results and update learning profiles
    const savedResults = [];
    const profileUpdates = [];

    for (const r of results) {
      const result = await prisma.quickCheckResult.create({
        data: {
          quickCheckId: quickCheck.id,
          studentId: r.studentId,
          status: r.status,
          score: r.score ?? (r.status === 'mastered' ? 3 : r.status === 'still_needs_practice' ? 2 : 1),
          maxScore: 3,
          notes: r.notes || ''
        }
      });
      savedResults.push(result);

      // Map quick check status to mastery
      const newMastery = r.status === 'mastered' ? 88 : r.status === 'still_needs_practice' ? 62 : 28;
      const newStatus = r.status === 'mastered' ? 'mastered' : r.status === 'still_needs_practice' ? 'developing' : 'needs_support';

      // Get the student's profile skill for this skill
      const profile = await prisma.learningProfile.findUnique({
        where: { studentId: r.studentId },
        include: { skills: { include: { skill: true } } }
      });

      if (profile) {
        const profileSkill = profile.skills.find(ps =>
          ps.skill.name === intervention.group.primarySkillName
        );

        const oldMastery = profileSkill?.masteryPct ?? 0;
        const oldStatus = profileSkill?.status ?? 'needs_support';

        if (profileSkill) {
          await prisma.learningProfileSkill.update({
            where: { id: profileSkill.id },
            data: { masteryPct: newMastery, status: newStatus }
          });
        }

        // Update overall profile status
        const allSkills = await prisma.learningProfileSkill.findMany({ where: { profileId: profile.id } });
        const hasNeedsSupport = allSkills.some(s => s.status === 'needs_support');
        const hasDeveloping = allSkills.some(s => s.status === 'developing');
        const newOverall = hasNeedsSupport ? 'needs_support' : hasDeveloping ? 'developing' : 'advanced';

        await prisma.learningProfile.update({
          where: { id: profile.id },
          data: { overallStatus: newOverall, primaryGap: hasNeedsSupport ? intervention.group.primarySkillName : '' }
        });

        // Record progress
        await prisma.progressRecord.create({
          data: {
            studentId: r.studentId,
            skillName: intervention.group.primarySkillName,
            masteryBefore: oldMastery,
            masteryAfter: newMastery,
            statusBefore: oldStatus,
            statusAfter: newStatus,
            event: 'quickcheck',
            eventId: quickCheck.id
          }
        });

        // Activity history
        await prisma.activityHistory.create({
          data: {
            studentId: r.studentId,
            type: 'quickcheck',
            title: `Quick Check: ${intervention.group.primarySkillName}`,
            description: `Result: ${r.status.replace('_', ' ')} — Mastery updated from ${Math.round(oldMastery)}% to ${newMastery}%`,
            recordedAt: new Date()
          }
        });

        profileUpdates.push({ studentId: r.studentId, before: oldStatus, after: newStatus });
      }
    }

    // Mark quick check as completed
    await prisma.quickCheck.update({
      where: { id: quickCheck.id },
      data: { status: 'completed', completedAt: new Date() }
    });

    // Summary
    const masteredCount = results.filter((r: any) => r.status === 'mastered').length;
    const developingCount = results.filter((r: any) => r.status === 'still_needs_practice').length;
    const needsSupportCount = results.filter((r: any) => r.status === 'needs_support').length;

    res.json({
      success: true,
      summary: { mastered: masteredCount, developing: developingCount, needsSupport: needsSupportCount },
      profileUpdates,
      quickCheckId: quickCheck.id
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get quick check by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const qc = await prisma.quickCheck.findUnique({
      where: { id: req.params.id as string },
      include: { results: { include: { student: true } }, intervention: { include: { group: true } } }
    });
    if (!qc) return res.status(404).json({ error: 'Not found' });
    res.json(qc);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
