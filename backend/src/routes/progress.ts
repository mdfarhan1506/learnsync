import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Class-level progress overview
router.get('/class/:classId', async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      where: { classId: req.params.classId as string },
      include: {
        profile: { include: { skills: { include: { skill: true } } } },
        progressRecords: { orderBy: { recordedAt: 'asc' } }
      }
    });

    const total = students.length;
    const mastered = students.filter(s => s.profile?.overallStatus === 'mastered' || s.profile?.overallStatus === 'advanced').length;
    const developing = students.filter(s => s.profile?.overallStatus === 'developing').length;
    const needsSupport = students.filter(s => s.profile?.overallStatus === 'needs_support').length;

    // Skill-level summary
    const skillMap: Record<string, { name: string; totalMastery: number; count: number; mastered: number; developing: number; needs_support: number }> = {};
    for (const student of students) {
      for (const ps of student.profile?.skills ?? []) {
        if (!skillMap[ps.skillId]) {
          skillMap[ps.skillId] = { name: ps.skill.name, totalMastery: 0, count: 0, mastered: 0, developing: 0, needs_support: 0 };
        }
        skillMap[ps.skillId].totalMastery += ps.masteryPct;
        skillMap[ps.skillId].count++;
        if (ps.status === 'mastered') skillMap[ps.skillId].mastered++;
        else if (ps.status === 'developing') skillMap[ps.skillId].developing++;
        else skillMap[ps.skillId].needs_support++;
      }
    }

    const skillSummary = Object.entries(skillMap).map(([id, s]) => ({
      skillId: id,
      skillName: s.name,
      avgMastery: s.count > 0 ? s.totalMastery / s.count : 0,
      mastered: s.mastered,
      developing: s.developing,
      needs_support: s.needs_support,
      total: s.count
    }));

    // Intervention history
    const interventions = await prisma.intervention.findMany({
      where: { group: { classId: req.params.classId as string } },
      include: {
        group: true,
        skill: true,
        quickChecks: { include: { results: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      isDemo: true,
      summary: { total, mastered, developing, needsSupport },
      skillSummary,
      interventionHistory: interventions.map(i => ({
        id: i.id,
        date: i.completedAt || i.createdAt,
        groupName: i.group.name,
        skillName: i.skill?.name || i.group.primarySkillName,
        durationMins: i.durationMins,
        status: i.status,
        studentCount: 0,
        quickCheckSummary: i.quickChecks.flatMap(qc => qc.results).reduce(
          (acc, r) => {
            if (r.status === 'mastered') acc.mastered++;
            else if (r.status === 'still_needs_practice') acc.developing++;
            else acc.needs_support++;
            return acc;
          },
          { mastered: 0, developing: 0, needs_support: 0 }
        )
      })),
      studentSummary: students.map(s => ({
        id: s.id,
        name: s.name,
        rollNumber: s.rollNumber,
        overallStatus: s.profile?.overallStatus ?? 'unknown',
        skills: s.profile?.skills.map(ps => ({
          skillName: ps.skill.name,
          masteryPct: ps.masteryPct,
          status: ps.status
        })) ?? []
      }))
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Student-level progress
router.get('/student/:studentId', async (req: Request, res: Response) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.studentId as string },
      include: {
        profile: { include: { skills: { include: { skill: true } } } },
        progressRecords: { orderBy: { recordedAt: 'asc' } },
        activityHistory: { orderBy: { recordedAt: 'desc' }, take: 20 },
        observations: { orderBy: { createdAt: 'desc' } },
        groupMembers: { include: { group: true } },
        quickResults: { orderBy: { createdAt: 'desc' }, take: 10 }
      }
    });

    if (!student) return res.status(404).json({ error: 'Student not found' });

    res.json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
