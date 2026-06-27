<div align="center">

# ✅ TaskFlow

**A full-stack Kanban-style task management app powered by AI.**  
Organize your work into boards, drag tasks across columns, and let Google Gemini estimate effort and due dates — all in a clean, responsive UI with dark mode support.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://mongoosejs.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google)](https://aistudio.google.com)

</div>

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center"><strong>Landing Page</strong></td>
    <td align="center"><strong>Login Page</strong></td>
  </tr>
  <tr>
    <td><img src="client/src/assets/landing page.png" alt="Landing Page" width="100%" /></td>
    <td><img src="client/src/assets/login page.png" alt="Login Page" width="100%" /></td>
  </tr>
  <tr>
    <td align="center"><strong>Dashboard</strong></td>
    <td align="center"><strong>Mobile View</strong></td>
  </tr>
  <tr>
    <td><img src="client/src/assets/Dasboard.png" alt="Dashboard" width="100%" /></td>
    <td><img src="client/src/assets/mobile view.png" alt="Mobile View" width="100%" /></td>
  </tr>
</table>

---

## ✨ Features

- **Kanban Boards** — Create multiple boards, each with `Todo`, `In Progress`, and `Done` columns
- **Drag & Drop** — Reorder tasks within and across columns using `@dnd-kit`
- **AI Estimates** — One-click AI suggestion for effort size (S/M/L), estimated hours, and a suggested due date via Google Gemini
- **Task Details** — Title, description, priority (low/medium/high), due date, and effort tracking
- **Auth** — Email/password sign-up + OAuth via Google and GitHub
- **Dark / Light Mode** — System-aware theme toggle persisted across sessions
- **Progress Charts** — Per-board task completion stats powered by Recharts
- **Responsive Design** — Fully usable on mobile, tablet, and desktop

---

## 🗂️ Project Structure

```
Task-Flow/
├── client/                         # React frontend (Vite)
│   ├── public/                     # Static assets (favicon, images)
│   ├── src/
│   │   ├── api/                    # Axios API call modules
│   │   │   ├── ai.js               # AI suggestion endpoint
│   │   │   ├── auth.js             # Auth (login, register, OAuth)
│   │   │   ├── axios.js            # Axios instance with base URL & interceptors
│   │   │   ├── boards.js           # Board CRUD calls
│   │   │   └── tasks.js            # Task CRUD calls
│   │   ├── assets/                 # Images and SVGs
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.jsx      # App shell with sidebar + navbar
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── Task/
│   │   │   │   └── TaskModal.jsx   # Create / edit task modal with AI button
│   │   │   └── UI/
│   │   │       ├── ConfirmDialog.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Skeleton.jsx
│   │   │       ├── ThemeToggle.jsx
│   │   │       └── Toast.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Global auth state
│   │   │   └── ThemeContext.jsx    # Global theme state
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useTheme.js
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # Public marketing page
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx       # Board list + stats
│   │   │   ├── BoardView.jsx       # Kanban board with drag & drop
│   │   │   ├── OAuthCallback.jsx   # Handles OAuth redirect token
│   │   │   └── NotFound.jsx
│   │   ├── App.jsx                 # Router and provider composition
│   │   ├── main.jsx
│   │   └── index.css               # Global CSS variables + base styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                         # Express backend (Node.js)
│   ├── config/
│   │   ├── db.js                   # MongoDB connection via Mongoose
│   │   └── passport.js             # Google & GitHub OAuth strategies
│   ├── controllers/
│   │   ├── aiController.js         # POST /api/ai/suggest
│   │   ├── authController.js       # Register, login, OAuth handlers
│   │   ├── boardController.js      # Board CRUD
│   │   └── taskController.js       # Task CRUD + drag-and-drop reorder
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification middleware
│   │   ├── errorHandler.js         # Global error handler
│   │   └── validate.js             # Joi request validation
│   ├── models/
│   │   ├── User.js                 # User schema (local + OAuth)
│   │   ├── Board.js                # Board schema
│   │   └── Task.js                 # Task schema (status, priority, effort)
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── boardRoutes.js
│   │   └── taskRoutes.js
│   ├── services/
│   │   └── aiService.js            # Google Gemini integration + fallback
│   ├── validators/                 # Joi validation schemas
│   ├── server.js                   # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 8](https://vite.dev) | Build tool & dev server |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| [@dnd-kit](https://dndkit.com) | Drag-and-drop for Kanban columns |
| [Recharts](https://recharts.org) | Task progress charts on dashboard |
| [Axios](https://axios-http.com) | HTTP client for API calls |
| [React Icons](https://react-icons.github.io/react-icons) | Icon library |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | Celebration animation on task completion |
| CSS Modules | Scoped component styles |

### Backend
| Tool | Purpose |
|---|---|
| [Node.js](https://nodejs.org) | Runtime |
| [Express 4](https://expressjs.com) | REST API framework |
| [MongoDB](https://mongodb.com) + [Mongoose](https://mongoosejs.com) | Database & ODM |
| [JWT](https://jwt.io) (`jsonwebtoken`) | Stateless authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [Passport.js](https://passportjs.org) | OAuth2 strategies (Google, GitHub) |
| [Joi](https://joi.dev) | Request validation |
| [@google/genai](https://googleapis.dev/nodejs/google-gax) | Google Gemini AI SDK |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable loading |

### Database
- **MongoDB Atlas** (or local MongoDB) — stores Users, Boards, and Tasks

---

## 🤖 AI Feature — Google Gemini

### Why Gemini?
Google Gemini (via `@google/genai`) was chosen for its:
- **Structured JSON output** — the SDK supports `responseMimeType: 'application/json'` and a `responseSchema`, so the response is directly parseable without regex hacks
- **Free tier availability** — Gemini 1.5 Flash and 2.0 Flash are available on the free tier at [aistudio.google.com](https://aistudio.google.com), making it easy to get started without a billing account
- **Model fallback chain** — the service tries `gemini-2.0-flash` → `gemini-1.5-flash` → `gemini-1.5-flash-8b` automatically on quota errors

### How it works
1. User opens the **Task Modal** and clicks **"AI Suggest"**
2. The frontend sends `POST /api/ai/suggest` with the task `title` and `description`
3. The server builds a prompt and calls the Gemini API, requesting a structured JSON response with:
   - `effort` — `S`, `M`, or `L` (Small / Medium / Large)
   - `estimatedHours` — integer
   - `suggestedDueDate` — `YYYY-MM-DD`
   - `reasoning` — a brief explanation
4. The response is validated and sanitized, then returned to the frontend
5. The modal auto-fills the effort and due date fields — the user can accept or edit them before saving
6. If the API key is missing or all models hit quota limits, a **fallback mock estimate** is returned based on task title length, so the app never hard-fails

---

## ⚙️ Local Setup

### Prerequisites
- [Node.js](https://nodejs.org) v18 or later
- [npm](https://npmjs.com) v9 or later
- A [MongoDB Atlas](https://cloud.mongodb.com) cluster (free tier works) or local MongoDB
- A [Gemini API key](https://aistudio.google.com/app/apikey) (free, no billing required)
- Google and/or GitHub OAuth app credentials (optional — only needed for social login)

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/task-flow.git
cd task-flow
```

---

### 2. Set up the backend

```bash
cd server
npm install
```

Create your `.env` file by copying the example:

```bash
cp .env.example .env
```

Then open `server/.env` and fill in your values:

```env
# MongoDB connection string
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/taskflow

# JWT — use a long random string
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Google Gemini API key — get one free at https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# OAuth — Google (https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OAuth — GitHub (https://github.com/settings/developers)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Must match the Vite dev server port
CLIENT_URL=http://localhost:5173

# Session secret for the OAuth handshake (any random string)
SESSION_SECRET=your_session_secret_here
```

> **OAuth is optional.** If you skip the Google/GitHub credentials, email/password login and all other features still work normally.

Start the backend:

```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`.  
Test it: `http://localhost:5000/api/health` should return `{ "success": true }`.

---

### 3. Set up the frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The app will open at **`http://localhost:5173`**.

> Vite is configured to proxy all `/api` requests to `http://localhost:5000`, so no extra CORS config is needed during development.

---

### 4. OAuth redirect URIs (optional)

If you enable Google or GitHub login, add these **Authorized Redirect URIs** in your OAuth app settings:

| Provider | Redirect URI |
|---|---|
| Google | `http://localhost:5000/api/auth/google/callback` |
| GitHub | `http://localhost:5000/api/auth/github/callback` |

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | ✅ | Token expiry (e.g. `7d`) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key for AI estimates |
| `CLIENT_URL` | ✅ | Frontend origin for OAuth redirects |
| `SESSION_SECRET` | ✅ | Session secret for Passport OAuth handshake |
| `GOOGLE_CLIENT_ID` | ⬜ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ⬜ | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | ⬜ | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | ⬜ | GitHub OAuth client secret |

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | Health check |
| `POST` | `/api/auth/register` | — | Create account |
| `POST` | `/api/auth/login` | — | Login with email/password |
| `GET` | `/api/auth/google` | — | Start Google OAuth flow |
| `GET` | `/api/auth/github` | — | Start GitHub OAuth flow |
| `GET` | `/api/auth/me` | JWT | Get current user |
| `GET` | `/api/boards` | JWT | List all boards |
| `POST` | `/api/boards` | JWT | Create a board |
| `PUT` | `/api/boards/:id` | JWT | Update a board |
| `DELETE` | `/api/boards/:id` | JWT | Delete a board + its tasks |
| `GET` | `/api/boards/:id/tasks` | JWT | List tasks for a board |
| `POST` | `/api/boards/:id/tasks` | JWT | Create a task |
| `PUT` | `/api/boards/:id/tasks/:taskId` | JWT | Update a task |
| `DELETE` | `/api/boards/:id/tasks/:taskId` | JWT | Delete a task |
| `POST` | `/api/ai/suggest` | JWT | Get AI effort estimate |

---

## 📄 License

MIT — feel free to use, fork, and build on this project.
