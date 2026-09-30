# 📋 Project Management

A full-stack project management app for planning projects, tracking tasks, and collaborating with teams. It features a Kanban board, list, table and Gantt timeline views, priority-based task filtering, an analytics dashboard, global search, and secure JWT authentication.

Built with **Next.js 16 + React 19** on the frontend and **Express 5 + Prisma + PostgreSQL** on the backend.

---

## ✨ Features

- **Authentication** – Register / login with JWT access tokens and refresh tokens stored in an httpOnly cookie, with automatic silent token refresh
- **Projects** – Create and manage projects with descriptions and start/end dates
- **Multiple project views**
  - **Board** – Drag-and-drop Kanban board (To Do → Work In Progress → Under Review → Completed)
  - **List** – Card-based task list
  - **Table** – Sortable, filterable data grid
  - **Timeline** – Gantt chart of tasks
- **Tasks** – Title, description, status, priority, tags, points, start/due dates, author and assignee
- **Comments** – Discuss on individual tasks
- **Priority views** – Filter tasks across projects by Urgent, High, Medium, Low, or Backlog
- **Dashboard** – Task distribution and priority charts at a glance
- **Teams & Users** – Create teams, assign members, and browse users
- **Global search** – Search across projects, tasks, and users
- **Settings** – Manage your profile
- **Dark mode** – Persisted theme preference
- **Toasts & modals** – Clean feedback and task/project creation flows

---

## 🛠️ Tech Stack

### Frontend
| Category | Technologies |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Material UI, Emotion |
| State & Data | Redux Toolkit, RTK Query, Redux Persist |
| UI Libraries | MUI X Data Grid, gantt-task-react, react-dnd, Recharts, Lucide React, react-hot-toast |
| Utilities | date-fns, lodash, numeral |

### Backend
| Category | Technologies |
| --- | --- |
| Runtime & Framework | Node.js, Express 5, TypeScript |
| Database | PostgreSQL with Prisma ORM (`@prisma/adapter-pg`) |
| Auth | JSON Web Tokens, bcryptjs, cookie-parser |
| Security & Logging | Helmet, CORS, Morgan |

---

## 📁 Project Structure

```
Project-Management/
├── backend/
│   ├── prisma/                 # Prisma schema & migrations
│   └── src/
│       ├── controllers/        # Request handlers
│       ├── services/           # Business logic
│       ├── routes/             # API route definitions
│       ├── middleware/         # Auth, validation, error handling
│       ├── types/
│       ├── prisma.ts           # Prisma client setup
│       └── index.ts            # Server entry point
│
└── frontend/
    ├── app/                    # Next.js App Router
    │   ├── (auth)/             # Login & register pages
    │   └── (dashboard)/        # Home, projects, priority, teams, users, search, settings, timeline
    ├── components/             # Shared layout & UI components
    ├── features/               # Feature modules (auth, dashboard, projects, tasks, priority, search, settings)
    ├── state/                  # Redux store, RTK Query APIs, slices
    ├── constants/              # Badge styles, data grid config
    ├── providers/              # Store provider
    ├── types/                  # TypeScript types
    └── public/                 # Static assets
```

---

## 🗄️ Database Schema

Core models: `User`, `Team`, `Project`, `ProjectTeam`, `Task`, `TaskAssignment`, `Comment`.

- A **Team** has many users and can be linked to many projects
- A **Project** has many tasks
- A **Task** has an author, an optional assignee, and many comments

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [PostgreSQL](https://www.postgresql.org/) database (local or hosted)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/AD202200651673/Project-Management.git
cd Project-Management
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/project_management"
PORT=8000
CLIENT_URL=http://localhost:3000

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
```

Run migrations, generate the Prisma client, and start the server:

```bash
npx prisma migrate dev
npx prisma generate
npm run dev
```

The API runs at `http://localhost:8000`.

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

### Backend (`/backend`)
| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Generate Prisma client and compile TypeScript |
| `npm start` | Run the compiled production build |

### Frontend (`/frontend`)
| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## 🔌 API Overview

All routes except `/auth/register`, `/auth/login`, `/auth/refresh-token` and `/auth/logout` require a valid access token (`Authorization: Bearer <token>`).

| Resource | Endpoints |
| --- | --- |
| **Auth** | `POST /auth/register` · `POST /auth/login` · `POST /auth/refresh-token` · `POST /auth/logout` · `GET /auth/me` |
| **Projects** | `GET /projects` · `POST /projects` · `GET /projects/:projectId` · `PUT /projects/:projectId` · `DELETE /projects/:projectId` |
| **Tasks** | `GET /tasks` · `POST /tasks` · `GET /tasks/:taskId` · `PUT /tasks/:taskId` · `PATCH /tasks/:taskId/status` · `DELETE /tasks/:taskId` · `GET /tasks/user/:userId` |
| **Comments** | `GET /tasks/:taskId/comments` · `POST /tasks/:taskId/comments` · `DELETE /tasks/comments/:commentId` |
| **Teams** | `GET /teams` · `POST /teams` · `PATCH /teams/:teamId/members` |
| **Users** | `GET /users` · `POST /users` · `GET /users/:userId` |
| **Search** | `GET /search` |

---

## 🔐 Authentication Flow

1. On login, the server returns a short-lived **access token** (15 min by default) and sets a long-lived **refresh token** (7 days) in an httpOnly cookie.
2. The frontend attaches the access token to every request via RTK Query.
3. When a request returns `401`, the app automatically calls `/auth/refresh-token` once (with a lock to avoid duplicate refreshes) and retries the original request.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Mayur**

- GitHub: (https://github.com/AD202200651673)
