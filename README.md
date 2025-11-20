## RAG QA Demo Frontend

Single-session Q&A UI for a RAG system, rebuilt with a modern glassmorphism look, gradient clouds, and Framer Motion animations. The sticky header carries live health status, while chat bubbles and composer keep a focused, immersive feel.

### Highlights
- Animated layout: full-viewport gradient blobs, glass cards, soft hover/press states, smooth bubble transitions.
- Health and history: calls `/health` and `/history?limit=20` on load, shows loading/error banners, auto-scrolls to the bottom.
- Chat bubbles: intent badges, timestamps, file indicator; assistant replies render Markdown and a sources table (hybrid/dense/BM25 scores).
- Composer: text plus optional PDF/DOCX/TXT attachment, Enter-to-send, validation for required input, and API errors; sends `POST /generate` as `multipart/form-data` with `web_search`/`return_stream`/`persist_documents` disabled.
- Configurable backend: defaults to `http://localhost:8000`; override via `frontend/.env` with `VITE_API_BASE_URL`.

### Key Files
- `frontend/src/App.tsx` — main layout, state, and animations.
- `frontend/src/api.ts` — HTTP client and error handling.
- `frontend/src/parse.ts` — strips `<document>...</document>` blocks and flags attachments.
- `frontend/src/components/*` — bubbles, badges, file indicator, sources table, and error banners.

### Run Locally
```bash
cd frontend
npm install
npm run dev
```
Dev server defaults to `http://localhost:5173` and proxies `/api/*` to `http://localhost:8000`.

### Build & Lint
```bash
npm run build
npm run lint
```

### UI Preview
Snapshots from the redesigned interface (see `demo*.png` in repo root):

![Demo 1](demo1.png)
![Demo 2](demo2.png)
![Demo 3](demo3.png)
![Demo 4](demo4.png)
