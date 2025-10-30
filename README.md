## RAG QA Demo Frontend

Simple single-session UI for a Retrieval-Augmented Generation (RAG) question-answering chat system. The app consumes the HTTP interface documented in `BACKEND_INTERFACE.md` and talks to `http://localhost:8000`.

### Requirements
- Node.js 18+
- Backend service running locally on port 8000 (see `BACKEND_INTERFACE.md`)

### Setup & Run
```bash
cd frontend
npm install
npm run dev
```

The dev server defaults to `http://localhost:5173`. Open it in your browser after starting the backend.

> ℹ️ During development the Vite dev server proxies `/api/*` to `http://localhost:8000`. If you prefer to hit a different base URL (for example in production), create a `.env` file inside `frontend/` with `VITE_API_BASE_URL="http://your-host:8000"`.

### Build & Lint
```bash
npm run build
npm run lint
```

### Features
- Loads recent history from `GET /history?limit=20` and hides content inside `<document>...</document>` while showing a file badge.
- Health check against `GET /health`; shows inline error banner when the backend is unavailable.
- Composer supports text plus optional PDF/DOCX/TXT attachment. Sends `POST /generate` as `multipart/form-data` with all required flags disabled (`web_search`, `return_stream`, `persist_documents`).
- Renders assistant replies with intent badge, tool call summary (if provided), and an expanded-by-default, collapsible sources table showing all scores and optional metrics.
- Inline error banners for validation (missing input/file) and API failures (422/500).

### File Map
- `frontend/src/api.ts` – typed API client helpers.
- `frontend/src/parse.ts` – `extractDisplayText` helper that strips `<document>` blocks and flags attachments.
- `frontend/src/components/*` – minimal Tailwind components (`IntentBadge`, `FileBadge`, `SourceList`, `MessageBubble`, `ErrorBanner`).
- `frontend/src/App.tsx` – main page layout, state management, and data flow.
