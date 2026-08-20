# LEARNsync — Adaptive Classroom Learning Orchestration

> **DEMO DATA** — All student data is fictional and for demonstration purposes only.

Teacher-first classroom orchestration platform that turns assessment data into targeted classroom action.

---

## Quick Start (Development)

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Start the Backend

```bash
cd backend
npm install
npx prisma db push
npm run seed      # Seeds 40 demo students + groups
npm run dev       # Starts on http://localhost:3001
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev       # Starts on http://localhost:3000
```

### 3. Login with Demo Account

| Field    | Value                       |
|----------|-----------------------------|
| Email    | `teacher@learnsync.demo`    |
| Password | `demo1234`                  |
| Class    | Class 5A · Grade 5 Maths   |
| Students | 40 (all fictional)          |

---

## Demo Walkthrough

**The core loop: Assess → Diagnose → Group → Intervene → Quick Check → Update**

1. **Dashboard** — See today's classroom plan with 4 learning groups already seeded
2. **Groups** — See WHY each group was formed (click the "WHY?" button)
3. **Group Detail** — Generate an AI intervention for the "Needs Support" group
4. **Intervention** — Walk through the step-by-step activity with a built-in timer
5. **Quick Check** — Mark each student as Mastered / Developing / Needs Support
6. **Progress** — See learning profiles updated in real-time with charts
7. **Assessments** — Create a new assessment (3-step wizard: Configure → Review → Deliver)
8. **Rules** — Customise mastery thresholds (default: Mastered ≥ 80%)

---

## Architecture

```
learnsync/
├── backend/              Node.js + Express + TypeScript + Prisma (SQLite)
│   ├── src/
│   │   ├── ai/           mockAI.ts — Grade 5 Math question bank
│   │   ├── engine/       diagnosisEngine.ts + groupingEngine.ts
│   │   ├── routes/       REST API routes
│   │   └── seed/         Demo data with 40 Indian student names
│   └── prisma/           schema.prisma + learnsync.db
│
├── frontend/             React 18 + Vite + TypeScript + Tailwind
│   └── src/
│       ├── pages/        17 pages (Dashboard, Groups, Assessments, Progress…)
│       ├── services/     api.ts — Axios service layer
│       └── stores/       Zustand (auth + class state)
│
├── docker-compose.yml    One-command production start
└── sample-students.csv   Import students via CSV
```

## API Endpoints

| Method | Path                                   | Description                          |
|--------|----------------------------------------|--------------------------------------|
| POST   | `/api/auth/login`                      | Login, returns JWT                   |
| GET    | `/api/classes`                         | List classes                         |
| GET    | `/api/classes/:id`                     | Class detail + students + groups     |
| GET    | `/api/assessments`                     | List assessments                     |
| POST   | `/api/assessments/:id/generate-questions` | AI question generation            |
| GET    | `/api/assessments/:id/analysis`        | Skill-level results breakdown        |
| GET    | `/api/groups/class/:classId`           | Groups for a class                   |
| POST   | `/api/groups/:id/generate-intervention` | AI intervention + other activities  |
| POST   | `/api/quick-checks`                    | Submit quick check, updates profiles |
| GET    | `/api/progress/class/:classId`         | Class-level progress overview        |
| GET    | `/api/progress/student/:studentId`     | Student profile + skill history      |
| PUT    | `/api/rules/:classId`                  | Update mastery thresholds            |
| POST   | `/api/demo/reset`                      | Reset to original seeded state       |

## Stack

| Layer      | Tech                                                         |
|------------|--------------------------------------------------------------|
| Frontend   | React 18, Vite, TypeScript, Tailwind CSS, Recharts, Zustand  |
| Backend    | Node.js, Express, TypeScript, Prisma ORM                     |
| Database   | SQLite (file-based, zero config)                             |
| AI         | Mock AI (Grade 5 Math content) + OpenAI fallthrough          |
| Auth       | JWT (bcryptjs passwords)                                     |
| DevOps     | Docker Compose                                               |

## Environment Variables (Backend)

```env
DATABASE_URL=file:./prisma/learnsync.db
JWT_SECRET=your-secret-key
PORT=3001
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=       # Optional — activates real LLM if present
```

## Reset Demo Data

```bash
# Via API (from the UI header "Reset Demo" button)
POST /api/demo/reset

# Via CLI
cd backend && npm run seed
```

---

*Built for the LEARNsync Hackathon MVP · All student data is fictional*
