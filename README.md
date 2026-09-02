# NEXUS — AI Engineering Command Center

> A production-grade AI-powered engineering command center for software development teams.

---

## ⚡ Architecture Overview

```
nexus/
├── frontend/                     # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Badge, Button, Card, StatCard, EmptyState, StatusIndicator
│   │   │   ├── dashboard/        # MetricsGrid, HealthChart, AIInsightPanel, ProjectHealth, Risks, Deployments, ActivityFeed
│   │   │   └── navigation/       # Sidebar, Topbar, CommandPalette (Ctrl+K)
│   │   ├── layouts/              # AppLayout (collapsible navigation & responsive shell)
│   │   ├── pages/                # CommandCenter, Projects, Intelligence, Security, Analytics, Team, Deployments, AIAssistant, Settings, NotFound
│   │   ├── services/             # Axios API client, DashboardService, typed mock data
│   │   ├── types/                # Strict TypeScript interfaces for telemetry, metrics, projects
│   │   └── utils/                # cn helper, formatters
│   └── package.json
└── backend/                      # Python + FastAPI Modular Scaffolding
    ├── app/
    │   ├── core/                 # Config & Settings (Pydantic)
    │   ├── models/               # SQLAlchemy Models
    │   ├── schemas/              # Pydantic Request/Response Schemas
    │   ├── routers/              # API Route Handlers
    │   ├── services/             # Business Logic & AI Services Layer
    │   ├── repositories/         # Database Query Repositories
    │   ├── utils/                # Helper utilities
    │   └── main.py               # FastAPI App Entrypoint
    └── requirements.txt
```

---

## 🚀 Getting Started

### 1. Frontend Development

```bash
cd nexus/frontend
npm install
npm run dev
```

The frontend will start at: `http://localhost:5173`

### 2. Frontend Production Build & Type Check

```bash
cd nexus/frontend
npm run build
```

---

## ⌨️ Shortcuts & Features

- **Command Palette**: Press `Ctrl + K` (or `Cmd + K`) anywhere to trigger the quick navigation and repository search palette.
- **Dark Developer Aesthetic**: Built with Linear/Vercel/GitHub dark design tokens, glass panels, glowing pulse badges, and high-density telemetry charts.
- **Full Navigation**: 9 dedicated sections ready with interactive states, filters, and modals.
