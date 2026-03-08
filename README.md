# Design_Hive_Quercus_Calendar_Extention

## Getting started

### Prerequisites

- **Node.js** (LTS or newer) and `npm`
- **Python 3.10+**

### Backend setup (FastAPI)

From the project root:

```bash
# Create (or reuse) the virtual environment
python -m venv venv

# Activate venv (PowerShell on Windows)
venv\Scripts\Activate

# Install backend dependencies
pip install -r requirements.txt

# Run the backend API
uvicorn backend.main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000` (e.g. `http://localhost:8000/health`).

### Frontend setup (React + Vite)

From the project root:

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will start (typically at `http://localhost:5173`).

### Requirements file

Backend Python dependencies are listed in `requirements.txt`:

- `fastapi`
- `uvicorn[standard]`

The `venv/` directory is already created and ignored by git so each developer can manage their own environment locally.

## Architecture

### Frontend (`frontend/`)

Vite + React + TypeScript application that serves as a high-fidelity prototype for the calendar UI:

- **Main Calendar page** (`pages/CalendarPage.tsx`):
  - Month/week/day view toggle.
  - List of fake assignments.
  - Clicking an assignment opens the Assignment/Event Panel.
  - Import button opens the Import Panel.
- **Assignments model** (`models/assignment.ts`):
  - TypeScript interfaces for assignments and calendar view type.
- **Course model** (`models/course.ts`):
  - TypeScript interface for course metadata so assignments can be categorized by course.
- **Assignments/Event Panel** (`components/AssignmentPanel.tsx`):
  - Popup to view/edit assignment details, save changes, and delete assignments.
- **Import Panel** (`components/ImportPanel.tsx`):
  - Popup listing assignments grouped by course with expand/collapse and checkboxes plus an import button (stubbed).
- **Dashboard page** (`pages/DashboardPage.tsx`):
  - Replica dashboard with a change alert button that opens the Change Review Panel.
- **Change Review Panel** (`components/ChangeReviewPanel.tsx`):
  - Popup that previews a due date change and, on confirm, updates an assignment in the calendar.
- **Session persistence** (`context/CalendarContext.tsx`):
  - In-memory state (courses, assignments, view mode, open panels) mirrored to `localStorage` so adding/modifying/deleting assignments persists across reloads within the prototype.

### Backend (`backend/`)

FastAPI application providing placeholder data and endpoints to support a future integration:

- **Models**:
  - Courses, assignments, and change review payloads in `backend/models/`.
- **Endpoints**:
  - Courses and assignments CRUD.
  - Import preview/apply stubs.
  - Change review preview/confirm stubs for updating an assignment deadline.

#### Where to edit backend models

- **Assignment data model class**: `backend/models/assignment.py`
- **Course data model class**: `backend/models/course.py`
- **Change review model (pending deadline changes)**: `backend/models/change_review.py`

### Environment and tooling

- **Python environment**:
  - Virtual environment in `venv/` (ignored by git).
  - Dependencies pinned via `requirements.txt`.
- **Node environment**:
  - Frontend dependencies managed in `frontend/package.json`.
- **Git ignore**:
  - `.gitignore` excludes `venv`, `frontend/node_modules`, `frontend/dist`, and common Python/cache/editor artifacts.

This boilerplate is designed so you can run the frontend and backend immediately to verify the extension shell before implementing real data flows and detailed UI/UX. 

### Editing guide for team members

- **Assignment data model (frontend)**:
  - TypeScript interface: `frontend/src/models/assignment.ts`
  - Feature entry: `frontend/src/features/assignments/index.ts`
  - Manual Assignment/Event change panel popup: `frontend/src/components/AssignmentPanel.tsx`
- **Course data model (frontend)**:
  - TypeScript interface: `frontend/src/models/course.ts`
  - Feature entry: `frontend/src/features/courses/index.ts`
- **Import Panel popup (frontend)**:
  - Panel UI: `frontend/src/components/ImportPanel.tsx`
  - Feature entry: `frontend/src/features/import-panel/index.ts`
- **Change Review Panel popup (frontend)**:
  - Panel UI: `frontend/src/components/ChangeReviewPanel.tsx`
  - Feature entry: `frontend/src/features/change-review/index.ts`