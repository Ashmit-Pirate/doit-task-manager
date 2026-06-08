# DoIT — Organize. Prioritize. Execute.

A production-grade task management web application built with the MERN stack and TypeScript.

**Live Demo:** [doit-task-manager.vercel.app](https://your-vercel-url.vercel.app) &nbsp;|&nbsp; **Backend API:** [doit-api.onrender.com](https://your-render-url.onrender.com)

> ⚠️ The backend is hosted on Render's free tier and may take 30–50 seconds to respond after a period of inactivity. This is expected behavior — the app is fully functional once the server wakes up.

---

## Features

- **JWT Authentication** — Register, login, persistent sessions via localStorage, protected routes
- **Full Task CRUD** — Create, edit, delete, and view tasks with title, description, priority, status, and due date
- **Status Workflow** — Three-state cycle: Pending → In Progress → Completed
- **Archive** — Archive tasks without deleting them; toggle visibility
- **Filters & Search** — Filter by status, priority, and free-text search; server-side
- **Pagination** — Page-based navigation on the Tasks view
- **Dashboard** — At-a-glance stats: total tasks, completed, overdue, and due within 3 days
- **Dark / Light Mode** — Toggleable, defaults to dark
- **Responsive UI** — Collapsible icon sidebar on desktop, hamburger drawer on mobile
- **Profile** — View account info and update password

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React + Vite + TypeScript | Core framework |
| Tailwind CSS + shadcn/ui | Styling and UI components |
| TanStack Query (v5) | Server state, caching, invalidation |
| react-hook-form + zod | Form validation |
| Framer Motion | Page transitions and sidebar animation |
| Axios | HTTP client with request/response interceptors |
| react-router-dom v6 | Client-side routing |
| sonner | Toast notifications |
| lucide-react | Icons |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express.js | Server and REST API |
| MongoDB Atlas + Mongoose | Database and ODM |
| jsonwebtoken | JWT generation and verification |
| bcryptjs | Password hashing |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |

---

## Project Structure

```
doit-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/       # Reusable UI components
        ├── contexts/         # AuthContext, ThemeContext
        ├── hooks/            # useAuth, useTasks, useDashboard
        ├── layouts/          # AppLayout (sidebar + navbar)
        ├── pages/            # Dashboard, Tasks, Profile, Login, Register
        ├── services/         # axios instance + interceptors
        └── types/            # Centralized TypeScript types
```

---

## API Reference

### Auth Routes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| PUT | `/api/auth/update-password` | Yes | Update password |

### Task Routes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tasks` | Yes | Get tasks (supports `?status`, `?priority`, `?search`, `?sort`, `?page`, `?limit`, `?archived`) |
| GET | `/api/tasks/:id` | Yes | Get a single task |
| POST | `/api/tasks` | Yes | Create a task |
| PUT | `/api/tasks/:id` | Yes | Update a task |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |
| PATCH | `/api/tasks/:id/toggle` | Yes | Cycle task status |
| PATCH | `/api/tasks/:id/archive` | Yes | Toggle archive |

All responses follow the format:
```json
{ "success": true, "message": "...", "data": { } }
```

---

## Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Ashmit-Pirate/doit-task-manager.git
cd doit-task-manager
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
node server.js
```

The API will be running at `http://localhost:5000`.

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## Key Implementation Notes

**No `/dashboard` endpoint** — The `useDashboard` hook fetches tasks with `?limit=100` and computes all stats (total, completed, overdue, due soon) client-side. This avoids an extra backend aggregation endpoint while keeping the dashboard accurate.

**401 Interceptor** — The Axios response interceptor clears the token and redirects to `/login` on a 401, but skips the redirect if the current path is `/login`, `/register`, or `/profile` to prevent false logouts on wrong-password attempts.

**Sidebar Transitions** — Text labels in the sidebar use CSS `opacity` and `max-width` transitions instead of conditional rendering (`{sidebarExpanded && <span>}`). This prevents the icon jump that occurs when DOM elements are removed and re-added during the animation.

**Status Cycle** — Task status toggles in a fixed order: `pending → in-progress → completed → pending`. `completedAt` is set when a task reaches `completed` and cleared when it cycles back to `pending`.

---

## Author

**Ashmit Singh**

B.Tech Computer Engineering - K.J. Somaiya School of Engineering

B.S. Data Science - IIT Madras

[GitHub](https://github.com/Ashmit-Pirate) · [Email](mailto:ashmitsingh6786@gmail.com)
