# 🌸 TaskFlow — Task & Project Management

A beautiful, full-stack Kanban-style task management application with a Japanese-inspired design aesthetic. Built with React, Node.js/Express, and MongoDB.

![Dashboard Empty State](./screenshots/dashboard.png)
![Board View with Tasks](./screenshots/board.png)

## ✨ Features

### Core
- **Authentication** — Register, login, JWT-based sessions, protected routes
- **Board Management** — Create, rename, delete boards with confirmation prompts
- **Task Management** — Full CRUD with status, priority, due dates, and effort estimates
- **Kanban Board** — Three-column layout (To Do, In Progress, Done) with drag-and-drop
- **AI Effort Estimation** — Smart due-date and effort suggestions powered by Google Gemini API

### Bonus
- 🎨 **Dark / Light Mode** — Toggle with persisted preference
- 📊 **Dashboard Analytics** — Charts showing tasks by status and priority (Recharts)
- 🔍 **Search & Filters** — Search tasks, filter by priority, sort by due date/priority
- 🖱️ **Drag & Drop** — Move tasks between columns with @dnd-kit
- ⚠️ **Overdue Indicators** — Visual cues for past-due tasks
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🏯 **Japanese Theme** — Sakura, indigo, matcha color palette with Noto Serif JP typography
- ✅ **Input Validation** — Joi on backend, inline on frontend
- 🔔 **Toast Notifications** — Success/error feedback for all actions
- 💀 **Loading Skeletons** — Shimmer placeholders while data loads
- 🚫 **Custom 404 Page** — Themed "path leads nowhere" page

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, CSS Modules |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) — Atlas hosted |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **HTTP Client** | Axios |
| **AI** | Google Gemini API (`@google/genai` — `gemini-2.0-flash`) |
| **Drag & Drop** | @dnd-kit/core + @dnd-kit/sortable |
| **Charts** | Recharts |
| **Validation** | Joi |
| **Icons** | react-icons (Ionicons) |
| **Fonts** | Inter + Noto Serif JP (Google Fonts) |

### Why Google Gemini API?
- Generous free tier with no credit card required
- Fast inference with `gemini-2.0-flash` model
- Simple SDK (`@google/genai`) for Node.js
- Reliable structured JSON output for effort estimation

## 📂 Project Structure

```
Task-Flow/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── api/                # Axios instance & API services
│   │   ├── components/         # Reusable components
│   │   │   ├── Auth/           # ProtectedRoute
│   │   │   ├── Board/          # Board-specific components
│   │   │   ├── Layout/         # Navbar, Sidebar, Layout
│   │   │   ├── Task/           # TaskModal
│   │   │   └── UI/             # Modal, Toast, Skeleton, etc.
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── hooks/              # useAuth, useTheme
│   │   ├── pages/              # Login, Register, Dashboard, BoardView, NotFound
│   │   └── index.css           # Design system (CSS custom properties)
│   └── package.json
│
├── server/                     # Express backend
│   ├── config/                 # Database connection
│   ├── controllers/            # Route handlers
│   ├── middleware/              # Auth, error handler, validation
│   ├── models/                 # Mongoose schemas (User, Board, Task)
│   ├── routes/                 # Express route definitions
│   ├── services/               # AI service (Gemini + mock fallback)
│   ├── validators/             # Joi validation schemas
│   ├── server.js               # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🚀 Setup & Run Locally

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key (optional — app works without it)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Task-Flow.git
cd Task-Flow
```

### 2. Backend setup
```bash
cd server
npm install

# Create .env from template
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# Start the server
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install

# Start the dev server
npm run dev
```

The app will be running at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/taskflow
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here    # Optional
PORT=5000
```

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | ❌ | Token expiration (default: 7d) |
| `GEMINI_API_KEY` | ❌ | Google Gemini API key for AI features |
| `PORT` | ❌ | Server port (default: 5000) |

## 🤖 AI Feature — Smart Effort Estimation

When creating or editing a task, click the **"Suggest"** button to get an AI-powered estimate:

1. The frontend sends the task title and description to `POST /api/ai/suggest`
2. The backend calls the Google Gemini API with a structured prompt
3. The AI returns: **effort size (S/M/L)**, **estimated hours**, **suggested due date**, and **reasoning**
4. The user can **accept** (pre-fills the form) or **dismiss** the suggestion

**Fallback:** If the `GEMINI_API_KEY` is not set or the API fails, a mock estimate is returned based on task title length. The app remains fully functional without AI.

## 📡 API Documentation

### Auth Endpoints
| Method | Path | Purpose | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | ❌ |
| POST | `/api/auth/login` | Login, get JWT | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Board Endpoints
| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/api/boards` | List user's boards | ✅ |
| POST | `/api/boards` | Create board | ✅ |
| GET | `/api/boards/:id` | Get single board | ✅ |
| PUT | `/api/boards/:id` | Update board | ✅ |
| DELETE | `/api/boards/:id` | Delete board + tasks | ✅ |

### Task Endpoints
| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/api/boards/:boardId/tasks` | List tasks (with filters) | ✅ |
| POST | `/api/boards/:boardId/tasks` | Create task | ✅ |
| GET | `/api/boards/:boardId/tasks/:id` | Get single task | ✅ |
| PUT | `/api/boards/:boardId/tasks/:id` | Update task | ✅ |
| DELETE | `/api/boards/:boardId/tasks/:id` | Delete task | ✅ |
| PATCH | `/api/boards/:boardId/tasks/:id/move` | Move task (status + position) | ✅ |

### AI Endpoint
| Method | Path | Purpose | Auth |
|---|---|---|---|
| POST | `/api/ai/suggest` | Get AI effort estimate | ✅ |

**Query Parameters** for `GET /api/boards/:boardId/tasks`:
- `status` — Filter by status (`todo`, `in-progress`, `done`)
- `priority` — Filter by priority (`low`, `medium`, `high`)
- `sort` — Sort by (`dueDate`, `priority`, `created`)
- `search` — Search title and description

## 🎨 Design Theme

The app uses a **Japanese/Japandi-inspired** design language:
- **Sakura (桜)** — Cherry blossom pink for accents and CTAs
- **Ai (藍)** — Traditional indigo for primary actions
- **Matcha (抹茶)** — Green for success and completion states
- **Sumi (墨)** — Ink-dark backgrounds
- **Kinari (生成り)** — Natural cream for light mode
- **Kitsune (狐)** — Amber/rust for warnings and in-progress states
- **Ume (梅)** — Plum red for danger and high priority

Typography: **Inter** (sans-serif) for UI + **Noto Serif JP** for headings.

## ⚠️ Known Issues / Limitations

- Drag-and-drop works within same column; cross-column drag may require a page refresh for position accuracy
- AI suggestions depend on Gemini API availability and free tier rate limits
- No real-time collaboration (single-user boards only)
- No image/file attachments on tasks
- No password reset / forgot password flow

## 🔮 Future Improvements

- Real-time updates with WebSockets
- Board sharing / collaboration
- Subtask support and task dependencies
- File attachments and rich text descriptions
- Activity log / audit trail
- Email notifications for due dates
- PWA support for offline access
- Docker setup for deployment
- Comprehensive test suite (Jest + Supertest + RTL)

## 📄 License

MIT
#   T a s k - - F l o w  
 