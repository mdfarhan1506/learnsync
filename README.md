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

## 🚂 Railway Deployment Guide

Deploy both services independently from the single GitHub repository (`mdfarhan1506/learnsync`):

### Step 1: Create a Railway Project
1. Log in to [Railway](https://railway.app/).
2. Click **+ New Project** and name it `LearnSync`.

### Step 2: Deploy Backend Service (`/backend`)
1. Click **+ New Service** → **GitHub Repo** → select `mdfarhan1506/learnsync`.
2. In the service **Settings**:
   - **Service Name**: `learnsync-backend`
   - **Root Directory**: `/backend`
   - **Build Command**: `npm run build` *(runs `prisma generate && tsc`)*
   - **Start Command**: `npm start` *(runs `node dist/index.js`)*
3. In **Variables**, add:
   - `DATABASE_URL`: `file:./prisma/learnsync.db` *(or your PostgreSQL / MySQL connection string)*
   - `JWT_SECRET`: `learnsync-super-secret-jwt-key-2024-hackathon` *(or your secure random string)*
   - `JWT_REFRESH_SECRET`: `learnsync-refresh-secret-2024`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `*` *(or update to your frontend domain once generated, e.g. `https://learnsync-frontend.up.railway.app`)*
4. Under **Networking**, click **Generate Domain** (e.g. `https://learnsync-backend.up.railway.app`).

### Step 3: Deploy Frontend Service (`/frontend`)
1. In the same `LearnSync` project, click **+ New Service** → **GitHub Repo** → select `mdfarhan1506/learnsync`.
2. In the service **Settings**:
   - **Service Name**: `learnsync-frontend`
   - **Root Directory**: `/frontend`
   - **Build Command**: `npm run build` *(runs `tsc -b && vite build`)*
   - **Start Command**: `npm start` *(serves static build via `serve -s dist -l $PORT`)*
3. In **Variables**, add:
   - `VITE_API_URL`: The backend domain generated in Step 2 (e.g. `https://learnsync-backend.up.railway.app`)
4. Under **Networking**, click **Generate Domain** (e.g. `https://learnsync-frontend.up.railway.app`).

### Step 4: Configure CORS on Backend
Once your frontend domain is active (e.g. `https://learnsync-frontend.up.railway.app`), update `FRONTEND_URL` in the backend service variables:
```
FRONTEND_URL=https://learnsync-frontend.up.railway.app
```

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
