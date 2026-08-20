import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  try {
    const groupId = req.query.groupI as string as string | undefined;
    const interventionId = req.query.interventionI as string as string | undefined;

    const activities = await prisma.interventionActivity.findMany({
      where: {
        ...(interventionId ? { interventionId } : {}),
        ...(groupId ? { intervention: { groupId } } : {}),
      },
      include: { intervention: { include: { group: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(activities);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await prisma.interventionActivity.findUnique({
      where: { id: req.params.id as string },
      include: { intervention: { include: { group: true, skill: true } } }
    });
    if (!activity) return res.status(404).json({ error: 'Not found' });
    res.json(activity);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updated = await prisma.interventionActivity.update({
      where: { id: req.params.id as string },
      data: req.body
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/approve', async (req: Request, res: Response) => {
  try {
    const updated = await prisma.interventionActivity.update({
      where: { id: req.params.id as string },
      data: { isApproved: true }
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
