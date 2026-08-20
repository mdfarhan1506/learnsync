import { Router, Request, Response } from 'express';
import { seedDatabase } from '../seed/seed';

const router = Router();

// Reset demo to original seeded state
router.post('/reset', async (_req: Request, res: Response) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Demo data has been reset to original state.' });
  } catch (error: any) {
    console.error('Demo reset error:', error);
    res.status(500).json({ error: 'Failed to reset demo', details: error.message });
  }
});

// Get demo status
router.get('/status', (_req: Request, res: Response) => {
  res.json({
    isDemoMode: true,
    credentials: { email: 'teacher@learnsync.demo', password: 'demo1234' },
    description: 'All data is fictional and for demonstration purposes only.',
    demoClass: 'Class 5A — Grade 5 Mathematics',
    demoStudents: 40
  });
});

export default router;
