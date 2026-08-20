import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        students: { select: { id: true } },
        assessments: { orderBy: { createdAt: 'desc' }, take: 1 },
        groups: { where: { status: 'active' }, select: { id: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(classes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const cls = await prisma.class.findUnique({
      where: { id: req.params.id as string },
      include: {
        students: { include: { profile: { include: { skills: { include: { skill: true } } } } }, orderBy: { rollNumber: 'asc' } },
        assessments: { orderBy: { createdAt: 'desc' } },
        groups: { where: { status: 'active' }, include: { members: { select: { studentId: true } } } }
      }
    });
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    res.json(cls);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const newClass = await prisma.class.create({ data: req.body });
    await prisma.assessmentRule.create({ data: { classId: newClass.id } });
    res.status(201).json(newClass);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await prisma.class.update({ where: { id: req.params.id as string }, data: req.body });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get topics for subject/grade
router.get('/:id/topics', async (req: Request, res: Response) => {
  try {
    const cls = await prisma.class.findUnique({ where: { id: req.params.id as string } });
    if (!cls) return res.status(404).json({ error: 'Class not found' });
    const subjects = await prisma.subject.findMany({
      where: { name: cls.subject },
      include: { topics: { include: { skills: true } } }
    });
    res.json(subjects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
