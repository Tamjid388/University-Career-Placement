# AGENTS.md — Smart Job Placement Portal

MERN monorepo: university career/placement platform with three roles
(jobseeker, employer, admin). Resume builder, portfolio builder,
job board, applications, interviews, skill assessments, payments (SSLCommerz).

## Layout

```
./Backend/   — Express API (ESM, `type: module`), deployed to Vercel via src/server.js
  src/app.js          — middleware + route mounting, exports `app`
  src/server.js       — mongoose.connect + app.listen (Vercel entry)
  src/routers/        — *.route.js, all mounted under /api/v1/...
  src/controllers/    — *.controller(s).js business logic
  src/models/         — Mongoose models (user, company, job, application, interview, portfolio, resumebuilder, skillassesment, payment)
  src/middlewares/    — verifytoken.js (cookie JWT), checkrole.js, requireemployer.js, requirejobseeker.js
  src/utils/          — generatetoken.js, mailer.js (nodemailer)
  src/config/         — database.js, firebaseconfig.js (+ gitignored firebaseServiceAccount.json)
./Frontend/  — Vite + React 18 SPA, deployed to Vercel
  src/main.jsx        — Authprovider > QueryClientProvider > ProfileProvider > PortfolioProvider > RouterProvider
  src/router/AppRouter.jsx — createBrowserRouter; `/` (MainLayouts) + `/dashboard` (DashBoardLayout) + `/portfolio/:slug`
  src/api/            — per-domain modules (auth, jobs, company, application, interview, portfolio, resumeBuilder, skillAssesment, payment, Statistics) + axiosInstance.js
  src/context/        — Authprovider, ProfileProvider, PortfolioProvider, ResumeProvider
  src/components/drawer/sidebarmenus/ — role sidebars (JobSeeker*, Employer*, Admin*)
  src/pages/ src/features/ src/hooks/ src/layouts/ src/utils/ src/firebase/firebase.config.js
```

## Commands

Backend (`Backend/`):
- `npm run dev` — nodemon src/server.js
- `npm start` — node src/server.js
- No tests (`npm test` is a stub that exits 1).

Frontend (`Frontend/`):
- `npm run dev` — vite (expects backend on localhost + `VITE_API_BASE_URL`)
- `npm run build` / `npm run preview` — vite build/preview
- `npm run lint` — `eslint .` (react-hooks + react-refresh; `no-unused-vars` is warn with `^[A-Z_]` ignore)

Root `package.json` only holds `react-responsive`; install/run inside `Backend/` and `Frontend/` separately.

## API conventions (Backend)

- Base path: `/api/v1/...` — see `Backend/src/app.js:29-56` for mounts:
  `/user /company /job /application /admin /interviews /portfolio /payment /resumebuilder /skillAssesment /statistics`.
- ESM with explicit `.js` extensions on relative imports. Keep this style.
- Auth: JWT in `token` cookie (`utils/generatetoken.js`, `middlewares/verifytoken.js:3-17`).
  Cookie flags depend on `NODE_ENV` (`secure` + `sameSite=None` in production). Role gates via `checkRole` / `requireEmployer` / `requirejobseeker`.
  Firebase Admin also used for Firebase login flow (`controllers/firebaseauth.controller.js`).
- CORS (`app.js:29-38`): allowlist `http://localhost:5173` + production frontend, `credentials: true`.
  Frontend must keep `withCredentials: true` (see `Frontend/src/api/axiosInstance.js:3-7`).
- Env (required, never commit): `MONGODB_URL`, `SECRET`, `PORT`, `NODE_ENV`,
  `EMAIL_USER`, `EMAIL_PASS`, `BACKEND_URL`, `FRONTEND_URL`, `STORE_ID`, `STORE_PASSWORD`.
  `Backend/.env` is gitignored (currently empty in this checkout).

## Frontend conventions

- Router: React Router v7 `createBrowserRouter` (`src/router/AppRouter.jsx`). Protected pages wrap in `<Privateroute>`.
  Dashboard children are role-prefixed: `jobseeker*`, `employer/*`, `manage*`/`adminDashboard`.
- Data: TanStack Query (`@tanstack/react-query`) + per-domain `src/api/*.js` modules over shared `axiosInstance`
  (`baseURL: import.meta.env.VITE_API_BASE_URL`, `withCredentials: true`). Do not hardcode backend URLs;
  stale commented production URL in `axiosInstance.js:5` is not the source of truth.
- Required env: `VITE_API_BASE_URL` (e.g. `http://localhost:3000/api/v1` for local dev).
  Firebase web config is currently hardcoded in `src/firebase/firebase.config.js:7-14` — do not duplicate it elsewhere.
- Styling: Tailwind CSS v4 (`@tailwindcss/vite`) + DaisyUI v5. UI libs: framer-motion, lucide-react, react-icons, recharts, swiper, react-hot-toast / react-toastify / sweetalert2.
- Path casing is inconsistent (`Components` vs `components`, `Empoloyer` typo in `pages/empoloyer/CreateJob`). Match existing import paths exactly; do not "fix" casing without verifying on disk (Windows is case-insensitive, Linux/Vercel is not).

## Rules for agents

1. Edit `Backend/` and `Frontend/` independently; never hoist deps to root.
2. New backend endpoint = router + controller + model (if needed) + mount in `app.js` under `/api/v1/...`; add matching `Frontend/src/api/<domain>.js` function using `axiosInstance`.
3. Auth: read user from `req.user` after `verifyToken`; enforce role with existing `checkRole`/`require*` middleware, don't reimplement.
4. Cookies: keep `secure`/`sameSite`/`domain` NODE_ENV branching when touching auth controllers.
5. Secrets: never commit `.env` or `src/config/firebaseServiceAccount.json` (both gitignored). Never paste secret values into code or docs.
6. Verify: `npm run lint` in `Frontend/`; boot backend (`npm run dev`) with a local `MONGODB_URL` and hit the touched route; boot frontend and exercise the touched page/role flow.

## Skills (`.agents/skills/`)

- Repo-local skills live in `.agents/skills/` (this repo: `.agents/skills/gstack/` with its `SKILL.md` + workflow dirs like `investigate/`, `qa/`, `review/`, `ship/`).
  Global fallback is `~/.agents/skills` or `~/.codex` depending on harness — prefer the repo-local copy when both exist.
- Invoke by skill name (e.g. `/investigate`, `/qa`, `/review`, `/ship`); follow the loaded `SKILL.md` workflow instead of improvising.
- Do not move, rename, or flatten `.agents/skills/`; new reusable workflows go in a new subdir with its own `SKILL.md`.
