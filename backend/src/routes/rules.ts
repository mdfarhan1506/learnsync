import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get rules for a class
router.get('/:classId', async (req: Request, res: Response) => {
  try {
    let rules = await prisma.assessmentRule.findUnique({ where: { classId: req.params.classId as string } });
    if (!rules) {
      rules = await prisma.assessmentRule.create({ data: { classId: req.params.classId as string } });
    }
    res.json(rules);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update rules
router.put('/:classId', async (req: Request, res: Response) => {
  try {
    const { masteredMin, developingMin, minQuestionsForSkill, minGroupSize, maxGroupSize, quickCheckCount, requireTeacherApproval } = req.body;
    const rules = await prisma.assessmentRule.upsert({
      where: { classId: req.params.classId as string },
      update: { masteredMin, developingMin, minQuestionsForSkill, minGroupSize, maxGroupSize, quickCheckCount, requireTeacherApproval },
      create: { classId: req.params.classId as string, masteredMin, developingMin, minQuestionsForSkill, minGroupSize, maxGroupSize, quickCheckCount, requireTeacherApproval }
    });
    res.json(rules);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Reset to defaults
router.post('/:classId/reset', async (req: Request, res: Response) => {
  try {
    const rules = await prisma.assessmentRule.upsert({
      where: { classId: req.params.classId as string },
      update: { masteredMin: 80, developingMin: 50, minQuestionsForSkill: 2, minGroupSize: 3, maxGroupSize: 12, quickCheckCount: 3, requireTeacherApproval: true },
      create: { classId: req.params.classId as string }
    });
    res.json(rules);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
