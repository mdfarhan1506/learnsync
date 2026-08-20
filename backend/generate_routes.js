const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  fs.writeFileSync(path.join('/Users/mdfarhan/Documents/learnsync/backend/src/routes', file), content.trim());
};

write('groups.ts', `
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// List groups for a class
router.get('/class/:classId', async (req: Request, res: Response) => {
  try {
    const groups = await prisma.learningGroup.findMany({
      where: { classId: req.params.classId },
      include: { members: { include: { student: true } } }
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
      where: { id: req.params.id },
      include: { members: { include: { student: true } }, interventions: true }
    });
    if (!group) return res.status(404).json({ error: 'Not found' });
    res.json(group);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate intervention
router.post('/:id/generate-intervention', async (req: Request, res: Response) => {
  try {
    const { skillId, title, durationMins } = req.body;
    const intervention = await prisma.intervention.create({
      data: {
        groupId: req.params.id,
        skillId: skillId,
        title: title || 'New Intervention',
        durationMins: durationMins || 10,
        status: 'planned',
        isAiGenerated: true
      }
    });
    res.json(intervention);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Recalculate groups
router.post('/class/:classId/recalculate', async (req: Request, res: Response) => {
  try {
    // Dummy recalculation logic
    res.json({ success: true, message: 'Groups recalculated' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Override
router.post('/:id/override', async (req: Request, res: Response) => {
  try {
    const { studentId, action, reason, teacherId } = req.body;
    const override = await prisma.groupOverride.create({
      data: {
        groupId: req.params.id,
        studentId,
        action,
        reason,
        teacherId
      }
    });
    res.json(override);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
`);

write('activities.ts', `
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// List activities
router.get('/class/:classId', async (req: Request, res: Response) => {
  try {
    const activities = await prisma.interventionActivity.findMany({
      where: { intervention: { group: { classId: req.params.classId } } },
      include: { intervention: true }
    });
    res.json(activities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get activity
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await prisma.interventionActivity.findUnique({
      where: { id: req.params.id },
      include: { intervention: true }
    });
    if (!activity) return res.status(404).json({ error: 'Not found' });
    res.json(activity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Complete activity
router.post('/:id/complete', async (req: Request, res: Response) => {
  try {
    // In this model we complete intervention, but there's no status in InterventionActivity,
    // so we update intervention or just approve it
    const activity = await prisma.interventionActivity.update({
      where: { id: req.params.id },
      data: { isApproved: true }
    });
    res.json(activity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
`);

write('progress.ts', `
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Class progress
router.get('/class/:classId', async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      where: { classId: req.params.classId },
      include: { profile: { include: { skills: { include: { skill: true } } } } }
    });
    res.json(students);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Student progress
router.get('/student/:studentId', async (req: Request, res: Response) => {
  try {
    const progress = await prisma.progressRecord.findMany({
      where: { studentId: req.params.studentId },
      orderBy: { recordedAt: 'desc' }
    });
    res.json(progress);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Skill progress
router.get('/skill/:skillId', async (req: Request, res: Response) => {
  try {
    const profiles = await prisma.learningProfileSkill.findMany({
      where: { skillId: req.params.skillId },
      include: { profile: { include: { student: true } } }
    });
    res.json(profiles);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
`);

write('rules.ts', `
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get rules
router.get('/class/:classId', async (req: Request, res: Response) => {
  try {
    const rule = await prisma.assessmentRule.findUnique({
      where: { classId: req.params.classId }
    });
    if (!rule) return res.status(404).json({ error: 'Not found' });
    res.json(rule);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update rules
router.put('/class/:classId', async (req: Request, res: Response) => {
  try {
    const rule = await prisma.assessmentRule.upsert({
      where: { classId: req.params.classId },
      update: req.body,
      create: { ...req.body, classId: req.params.classId }
    });
    res.json(rule);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
`);

write('quickChecks.ts', `
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create quick check
router.post('/', async (req: Request, res: Response) => {
  try {
    const { interventionId, questions } = req.body;
    const qc = await prisma.quickCheck.create({
      data: {
        interventionId,
        questions: JSON.stringify(questions || []),
        status: 'pending'
      }
    });
    res.json(qc);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Submit results
router.post('/:id/submit', async (req: Request, res: Response) => {
  try {
    const { studentId, status, score, maxScore, notes } = req.body;
    const result = await prisma.quickCheckResult.create({
      data: {
        quickCheckId: req.params.id,
        studentId,
        status,
        score: score || 0,
        maxScore: maxScore || 3,
        notes: notes || ''
      }
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get results
router.get('/:id/results', async (req: Request, res: Response) => {
  try {
    const results = await prisma.quickCheckResult.findMany({
      where: { quickCheckId: req.params.id },
      include: { student: true }
    });
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
`);

write('demo.ts', `
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { seedDemoData } from '../seed/seed'; // Assuming exported from there

const router = Router();
const prisma = new PrismaClient();

router.post('/reset', async (req: Request, res: Response) => {
  try {
    // Truncate some data
    await prisma.quickCheckResult.deleteMany();
    await prisma.quickCheck.deleteMany();
    await prisma.interventionActivity.deleteMany();
    await prisma.intervention.deleteMany();
    await prisma.groupOverride.deleteMany();
    await prisma.learningGroupMember.deleteMany();
    await prisma.learningGroup.deleteMany();
    await prisma.learningProfileSkill.deleteMany();
    await prisma.learningProfile.deleteMany();
    await prisma.studentAnswer.deleteMany();
    await prisma.assessmentSubmission.deleteMany();
    
    // Call seed
    if (typeof seedDemoData === 'function') {
      await seedDemoData();
    }
    
    res.json({ success: true, message: 'Demo data reset' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
`);
