const fs = require('fs');
const path = require('path');

const routes = [
    "auth", "classes", "students", "assessments",
    "groups", "activities", "progress", "rules",
    "quickChecks", "demo"
];

const dirs = [
    "src/routes", "src/engine", "src/ai", "src/seed", "src/middleware"
];

dirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
});

routes.forEach(route => {
    const file = path.join("src/routes", `${route}.ts`);
    const content = `import { Router, Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Add routes here

export default router;
`;
    fs.writeFileSync(file, content);
});

const validateContent = `import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validate = (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
`;
fs.writeFileSync("src/middleware/validate.ts", validateContent);
