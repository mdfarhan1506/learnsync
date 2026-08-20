import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req, res) => {
  const classId = req.query.classId as string | undefined;
  try {
    const students = classId 
      ? await prisma.student.findMany({ where: { classId } })
      : await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ 
      where: { id: req.params.id as string },
      include: { profile: true, observations: true }
    });
    if (!student) return res.status(404).json({ error: 'Not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newStudent = await prisma.student.create({ data: req.body });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await prisma.student.update({
      where: { id: req.params.id as string },
      data: req.body
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.student.delete({ where: { id: req.params.id as string } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/observations', async (req, res) => {
  try {
    const { text, skillContext, teacherId } = req.body;
    const observation = await prisma.teacherObservation.create({
      data: {
        text,
        skillContext: skillContext || '',
        teacherId,
        studentId: req.params.id as string
      }
    });
    res.status(201).json(observation);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/import-csv', async (req, res) => {
  try {
    const { csv, classId } = req.body;
    if (!csv || !classId) return res.status(400).json({ error: 'Missing csv or classId' });
    
    const lines = csv.split('\n');
    const students = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      // Assuming simple format: rollNumber,name
      const [rollNumber, name] = line.split(',');
      if (rollNumber && name) {
        students.push({ rollNumber: rollNumber.trim(), name: name.trim(), classId });
      }
    }
    
    const created = await prisma.student.createMany({
      data: students,
      
    });
    
    res.json({ success: true, count: created.count });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
