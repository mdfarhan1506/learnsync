# LEARNsync — Adaptive Classroom Learning Orchestration

> **DEMO DATA** — All student data is fictional and for demonstration purposes only.

Teacher-first classroom orchestration platform that turns assessment data into targeted classroom action.

---

## 🏗️ Architecture

LEARNsync is structured as a clean monorepo with two independent services:

```
Railway / Monorepo
└── LearnSync (Project)
    ├── Frontend Service → /frontend (React + Vite + TypeScript + Tailwind)
    └── Backend Service  → /backend  (Node.js + Express + Prisma ORM)
```

---

## 🐳 Docker Deployment (One-Command Run)

Run both the frontend and backend together with Docker Compose:

```bash
docker compose up --build
```

- **Frontend**: Accessible at [http://localhost:3000](http://localhost:3000)
- **Backend API**: Accessible at [http://localhost:3001](http://localhost:3001)
- **Health Check**: [http://localhost:3001/api/health](http://localhost:3001/api/health)

---

## 🚀 Deployment Platforms

### 1. Railway (Recommended)
1. **Backend Service** (`/backend`):
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Env: `DATABASE_URL=file:./prisma/learnsync.db`, `JWT_SECRET=...`, `FRONTEND_URL=*`
2. **Frontend Service** (`/frontend`):
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Env: `VITE_API_URL=https://<your-backend-domain>.up.railway.app`

### 2. Render
1. **Backend Web Service** (Root: `backend`, Environment: `Node`):
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
2. **Frontend Static Site** (Root: `frontend`):
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Env: `VITE_API_URL=https://<your-render-backend-url>`

### 3. Vercel
Deploy the monorepo using the included [vercel.json](file:///Users/mdfarhan/Documents/learnsync/vercel.json) or deploy `/frontend` with `VITE_API_URL` pointing to your hosted backend.

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- npm 9+

### Terminal 1 — Backend (Port 3001)
```bash
cd backend
npm install
npx prisma db push
npm run seed      # Seeds 40 demo students + groups
npm run dev       # Starts on http://localhost:3001
```

### Terminal 2 — Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev       # Starts on http://localhost:3000
```

### Demo Login Credentials
| Field | Value |
|---|---|
| **Email** | `teacher@learnsync.demo` |
| **Password** | `demo1234` |
| **Class** | Class 5A · Grade 5 Maths |
| **Students** | 40 fictional students |

---

## 🔄 Core Classroom Loop

```
ASSESS → DIAGNOSE → GROUP → PLAN → INTERVENE → QUICK CHECK → UPDATE → NEXT ACTION
```

1. **Dashboard**: Daily classroom overview with 4 auto-generated learning groups.
2. **Groups**: View transparent "WHY THIS GROUP?" explanations and skill gaps.
3. **Intervention**: Timed 10-minute step-by-step facilitation scripts for targeted skills.
4. **Quick Check**: 1-tap evaluation (Mastered / Still Needs Practice / Needs Support).
5. **Progress**: Real-time mastery analytics and learning timelines.
6. **Assessments Wizard**: 3-step creation with AI question generation.
7. **Rules Engine**: Customizable mastery thresholds and group parameters.

---

## 🛠️ API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Service health & ping |
| GET | `/api/health` | API health check |
| POST | `/api/auth/login` | Teacher authentication |
| GET | `/api/classes` | Class list & overview |
| GET | `/api/classes/:id` | Class detail with students & assessments |
| GET | `/api/groups/class/:classId` | Active learning groups with WHY explanations |
| POST | `/api/groups/:id/generate-intervention` | AI-generated intervention activity |
| POST | `/api/quick-checks` | Submit quick check results & update profiles |
| GET | `/api/progress/class/:classId` | Class mastery distribution & history |
| GET | `/api/progress/student/:studentId` | Student skill profile & learning timeline |
| PUT | `/api/rules/:classId` | Update skill mastery thresholds |
| POST | `/api/demo/reset` | Restore initial seeded demo state |

---

## ⚙️ Environment Variables Summary

### Frontend (`/frontend`)
| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend URL (e.g. `https://learnsync-backend.up.railway.app` in prod, `http://localhost:3001` in dev) |

### Backend (`/backend`)
| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Database connection string (`file:./prisma/learnsync.db` or PostgreSQL URL) |
| `JWT_SECRET` | Yes | Secret key for signing authentication JWTs |
| `JWT_REFRESH_SECRET` | No | Secret key for refresh tokens |
| `PORT` | Auto | Port provided dynamically by Railway (defaults to 3001 locally) |
| `FRONTEND_URL` | Yes | Allowed frontend origin(s) for CORS |
| `OPENAI_API_KEY` | No | Optional OpenAI API key (falls back to built-in Mock AI if omitted) |

---

*Built for the LEARNsync Hackathon MVP · All student data is fictional*
