# Resume 2026 Standard — Gap Audit + Roadmap

> Scope: Resume Builder only (MVP is done). No code ships with this doc — it is the build spec for making resumes competitive in 2026.
> Conventions from `AGENTS.md` apply: Backend ESM with explicit `.js` imports, routes under `/api/v1/...` in `Backend/src/app.js`, JWT in `token` cookie + `req.user`, `withCredentials: true` in `Frontend/src/api/axiosInstance.js`. Never commit `.env` or `firebaseServiceAccount.json`.
> Research baseline: 2026 hiring = ATS parse first, LLM semantic rank second, human skim third (Jobscan / Greenhouse / Oracle 2026 guides; SSI People 2026 trends; ResumeVera AI-proof guide). U.S. postings requiring AI skills +144% YoY (Apr 2026).

## 1. What "2026 standard" means (7 pillars)

| # | Pillar | What it requires in 2026 | Why |
|---|--------|--------------------------|-----|
| 1 | **Machine-parseable first** | Single-column layout, standard headings (`Professional Summary, Work Experience, Education, Skills, Projects, Certifications`), no tables / text boxes / multi-column / headers-footers / graphics-as-text, selectable-text PDF (not scanned/image), standard fonts (Helvetica/Arial 10–12pt) | ATS parsers (and Indeed/Jobscan 2026 guidance) drop or scramble content in complex layouts. If it can't be parsed, content doesn't matter. |
| 2 | **Semantic match, not keyword stuff** | Mirror the target job description's language naturally: target job title, skill variants + adjacent tools, domain verbs, placed in Summary / Skills / bullets — never verbatim JD paste | LLM screeners judge meaning, progression, and role relevance, not just exact keyword hits. Stuffing is penalized. |
| 3 | **Quantified achievements** | Every experience/project bullet: action verb + scope + metric + timeframe (e.g. "Led 6-person team, cut ticket time 32% in 2 quarters"). No "Responsible for…" | Both AI rankers and humans score numbers, scope, and timeframes; vague duties score ~zero. |
| 4 | **Skills-first hybrid option** | Students / freshers / switchers get Summary → Key Skills (JD-matched trio) → Projects → Experience → Education order; experienced hires get Summary → Experience → Skills | 2026 trend: skills-first hybrid beats pure chronological for non-linear careers (university portal = mostly pillar-4 users). |
| 5 | **Proof + consistency** | Live links (LinkedIn, GitHub, portfolio/:slug, cert verification) that match profile data; consistent `MMM YYYY` dates; location + work-authorization line; contact block parseable on one line | AI cross-checks LinkedIn/portfolio/GitHub; knockout questions (auth, location, YoE) screen out before scoring. |
| 6 | **One tailored resume per application** | Never one generic resume. Duplicate → tailor to `jobId` → track which resume version went with which application | Employers weight scoring per role; a generic resume loses to a tailored one every time. |
| 7 | **AI literacy visible** | Explicit line for AI/tool fluency where true (e.g. "AI-assisted code review, prompt engineering, Copilot/ChatGPT workflows") — not buried in a skill cloud | Roles outside engineering now screen for "can work alongside AI"; deserves its own line. |

## 2. Current MVP — verified gap audit

### 2.1 What exists today (good foundation, keep it)

- Wizard flow: `Frontend/src/pages/resumebuilder/resumeui/BuildYourResume.jsx:15-68` + `Stepper.jsx` — About → Education → Experience → Skills → Projects → Additional → Preview.
- State: `Frontend/src/context/ResumeProvider.jsx:15-22` + `react-hook-form` per step, `useUserResumes` hydration.
- Save: `POST /resumebuilder` via `Frontend/src/api/resumeBuilder.js:3-11` → `resumebuilder.controller.js:5-52` (upsert).
- Export: client-side `@react-pdf/renderer` `PDFDownloadLink` in `forms/ResumePreview.jsx:50-64`, 4 PDF templates (`pdftemplates/PdfEngineerTemp1.jsx`, `PdfTemp1.jsx`, `PdfStudentTemp2.jsx`, `PdfDesignerTemp1.jsx`) + HTML previews.
- Model: `Backend/src/models/resumebuilder.model.js:47-62` — about / education / experience (`description: [String]`) / skills (`level` enum) / projects / additional.

### 2.2 Gaps vs. §1 (nothing here is a criticism of the MVP — it's the delta to 2026)

| Gap | Evidence (file:line) | Which pillar it breaks |
|-----|----------------------|------------------------|
| **One resume per user** — `createResume` does `findOne({userId})` + upsert; `getUserResumes` does `findOne` (despite the plural name) | `resumebuilder.controller.js:16-27,65-68` | P6 — tailoring per job is impossible; saving a second version silently overwrites the first. |
| **No job linkage** — no `jobId` / `applicationId` / `targetRole` / version name on the model | `resumebuilder.model.js:47-62` | P6 — can't answer "which resume did I send to job X?" |
| **Years only, no months** — `startYear/endYear: String` everywhere | `resumebuilder.model.js:3-16`, `ResumeExperienceForm.jsx:43-64` | P5 — "2021–2023" can't prove YoE for knockout filters; `MMM YYYY` is the 2026 expectation. |
| **No ATS check despite "ATS-friendly" claim** — landing page claims it, no validator exists | `ResumeBuilder.jsx:10,27`, `ResumePreview.jsx:71-77` (tip box only) | P1 — users ship untested PDFs. |
| **Headings are non-standard** — PDF uses `Summary`, `Work Experience` ok, but HTML/PDF variants drift; no heading whitelist enforced | `PdfEngineerTemp1.jsx:96,104,129,170,180` | P1 — creative headings get misclassified by parsers. |
| **Designer/multi-column templates unmarked** — `Designertemplate.jsx` + `PdfDesignerTemp1.jsx` exist with no "human-only, not for ATS apply" warning | `templates/designer/Designertemplate.jsx`, `pdftemplates/PdfDesignerTemp1.jsx` | P1 — prettiest template is the least parseable. |
| **Filler defaults ship into PDFs** — `"Name not provided"`, fake `TechCorp/CodeWorks`, fake Daffodil degrees render when fields are empty | `PdfEngineerTemp1.jsx:52-59,115-125,157-165,202-213` | P5 — a half-filled resume exports lies; must block export or omit sections instead. |
| **No metric coaching** — experience tip says "3 bullets" but never asks for numbers/scope/timeframe; description is a free-text array | `ResumeExperienceForm.jsx:198-201`, `resumebuilder.model.js:15` | P3 — bullets stay vague. |
| **Skills are free text + level only** — no JD-match, no years, no grouping; `additional.languages/certifications/awards` are single `String`s | `resumebuilder.model.js:18-31` | P2 — can't surface "Key Skills trio" or cert verification links. |
| **Missing 2026 fields** — no `targetTitle`, `workAuth`, `city/Country` split, `github`, `certLinks[]`, `aiTools` line, `summary` has no length guard | `resumebuilder.model.js:33-41`, `ResumeAboutForm.jsx:61-186` | P4, P5, P7 |
| **No auth on resume routes** — router has no `verifyToken`; `userId` comes from body/params (spoofable) | `routers/resume.route.js:9-12`, `resumebuilder.controller.js:7` | Trust — any client can read/write anyone's resume by id. Fix before any sharing feature. |
| **Single save, no autosave/draft/version** — Save button only; `resetResume` drops `additional` key inconsistently; no updatedAt shown | `resumeui/DownloadResume.jsx:15-23`, `ResumeProvider.jsx:65-73` | UX — users lose work; no history. |
| **Export filename is weak** — `${about?.name \|\| "resume"}.pdf`, no role/year, no metadata | `ResumePreview.jsx:56` | P5 — recruiters get `resume(3).pdf`. |
| **No import** — can't upload an existing PDF/LinkedIn to prefill; freshers retype everything | (absent — no import path in `api/resumeBuilder.js`) | Adoption — biggest drop-off point. |
| **No employer-view / share consent** — resume visible only to owner; applications don't attach a resume snapshot | (absent — `application` flow has `ResumeUpload.jsx` file upload, disconnected from builder) | P6 — builder output never reaches the hiring loop. |

## 3. Recommendations (prioritized)

### P0 — Must-have for "2026 standard" (do first, in this order)

**R1. Multi-resume + target-role model (Backend).**
Extend `resumebuilder.model.js` (additive, non-breaking):
```js
// add to resumeBuilderSchema — keep all existing fields
resumeName: { type: String, default: "My Resume" },   // "Grameenphone Backend Intern"
targetRole: String,                                    // exact JD title — P2/P6
jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null },
applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", default: null },
isPrimary: { type: Boolean, default: false },
language: { type: String, default: "en" },
settings: { headingStyle: { type: String, default: "standard" } },
```
Plus `{ timestamps: true }` on the schema. Change `createResume` from `findOne({userId})`-upsert to true create + separate `PUT /:id`; add `GET /user/:userId` returning an **array** (keep old `findOne` path deprecated for one release, flag in response). Scope every route to `req.user` after adding `verifyToken` (see R7). Index `{ userId: 1, updatedAt: -1 }`.

**R2. Date + contact correctness (Backend + 2 forms).**
Replace year-strings with month-resolution: `startDate/endDate: { month, year }` + `isCurrent: Boolean` (keep `startYear/endYear` as deprecated fallback for old docs). Split `about.location` → `city, country`, add `workAuth, github, targetTitle`. `summary` maxlength 400 with counter in `ResumeAboutForm.jsx`. This unblocks YoE knockout filters (P5).

**R3. ATS-safe template contract (Frontend, zero new deps).**
Codify and enforce for every template that carries an "ATS-safe" badge:
- Single column, standard headings only (`Professional Summary | Work Experience | Education | Skills | Projects | Certifications`), Helvetica, 10.5–12pt body, black text, no tables/columns/text-boxes/headers-footers/icons-as-text.
- PDF must be selectable text (test: `pdftotext` / any PDF parser extracts sections in order).
- Audit the 4 PDF + 4 HTML templates; badge Engineer/Student templates ATS-safe after fixes, label Designer template "Portfolio / human-only — do not submit to ATS" in `TemplateGrid.jsx` + `SelectOption.jsx`.
- Delete filler defaults in `PdfEngineerTemp1.jsx:52-59,115-213`: omit empty sections, never render fake companies/degrees; block Download when `about.name/email` missing with inline error.

**R4. Pre-export ATS checklist (Frontend, client-side first).**
New `src/pages/resumebuilder/lib/atsCheck.js` — pure function, no deps:
```js
checkATS(resumeData) // -> [{ id, label, pass, hint }]
// checks: contact complete | summary 250–400 chars | standard headings |
//         dates MMM YYYY + no gaps flag | ≥1 metric (number) per experience |
//         skills ≥ 6 + match vs pasted JD keywords | 1 page estimate (char/line budget) |
//         no photo/table/column markers | links are https + reachable format
```
Render as a checklist panel in `ResumePreview.jsx` next to Download (reuse the existing Quick-Tip box slot, `:72-77`). Gate: warn (don't hard-block except missing name/email) — show score `passed/total`. JD-paste textarea optional in v1; full JD-match moves to R8.

**R5. Bullet metric coach (1 form change).**
In `ResumeExperienceForm.jsx` + `ResumeProjectForm.jsx`: per-bullet hint ("Add a number: %, $, users, latency") + weak-verb lint (`responsible for, helped, worked on` → suggest `led, shipped, cut, grew`). Store bullets as `{ text, metric? }` later; v1 keeps `[String]` and lints text only — no migration needed.

**R6. Export filename + metadata.**
`fileName={`${about.name}_${targetRole || "Resume"}_2026.pdf`}` sanitized; set PDF `title/author` in `@react-pdf/renderer` `Document` props. 3-line change in `ResumePreview.jsx:50-56`.

**R7. Auth + ownership (Backend, do with R1).**
Add `verifyToken` to `routers/resume.route.js`, read `req.user.id` instead of `req.body.userId`, assert `resume.userId === req.user.id` on GET/PUT/DELETE. Fixes the spoofable-id hole before multi-resume/sharing lands.

### P1 — Competitive (next release)

**R8. Tailor-to-job flow.** `Duplicate for job → paste JD → keyword gap (client-side token overlap vs `skills + bullets`) → rewrite assist → save with `jobId` + `targetRole`.** New endpoint `POST /resumebuilder/:id/duplicate`. Frontend: button in `ManageResume.jsx` + job-detail page ("Build tailored resume"). Success = every application created from a job page offers a tailored copy in ≤3 clicks.
**R9. Structured skills + certs.** `skills: [{ name, years, group: "Languages|Frontend|Backend|DevOps|AI Tools|Soft" }]`; `certifications: [{ name, issuer, year, url }]` (replaces the `additional.certifications: String`). Powers the "Key Skills trio" block under the headline (2026 YouTube/Jobscan pattern) and verifiable proof links (P5).
**R10. Import v1.** Upload PDF → prefill wizard (client-side `pdfjs` text extraction, map by heading whitelist; manual review step — never silent). Cuts fresher drop-off.
**R11. Attach builder resume to applications.** `application` gets optional `resumeId` snapshot (copy-on-submit so later edits don't rewrite history); employer application view renders the snapshot + PDF link with seeker consent. Connects builder output to the hiring loop (closes the `ResumeUpload.jsx` disconnect).
**R12. One-page budget meter.** Live estimator in Preview (chars/lines → pages at current font); warn past 1 page for <5 YoE, 2 pages max otherwise. 2026 recruiters skim; length discipline is a feature.

### P2 — Differentiators (only after P0+P1 are live and measured)

- **R13. Server-side ATS score + JD match API** (`POST /resumebuilder/score` — reuses `atsCheck.js` logic + JD overlap, returns score + gaps; no LLM needed for v1).
- **R14. Optional AI rewrite** (bullet tightening, summary from experience) behind explicit opt-in + "AI-assisted" disclosure line; never auto-fabricate metrics.
- **R15. Public share link** (`/r/:slug`, modeled on existing `/portfolio/:slug`) with visibility toggle + revoke; private by default.
- **R16. DOCX export** (some ATS pipelines prefer `.docx`); keep PDF as default.
- **R17. Bengali + English templates** (portal serves BD universities — dual-language ATS-safe template is a genuine moat).

### Explicit non-goals for the 2026 pass
Design-system overhaul, drag-and-drop canvas, new UI deps, server PDF rendering, auto-apply, or AI auto-fill without user review. None is needed for the standard and each risks ATS-parseability.

## 4. Suggested build order (4 phases, each shippable)

- **Phase 0 — Safety (½ sprint):** R7 auth/ownership + R3 filler-default removal + R6 filename. No schema change; unblocks everything.
- **Phase 1 — Model (1 sprint):** R1 multi-resume + timestamps + `PUT /:id` + array GET + `ManageResume.jsx` list/duplicate/delete UI. Migrate old single docs (`isPrimary: true`, `resumeName: "My Resume"`).
- **Phase 2 — 2026 correctness (1 sprint):** R2 dates/contact + R5 bullet coach + R9 skills/certs structure + R3 template audit/badging.
- **Phase 3 — Trust at export (1 sprint):** R4 checklist panel + R12 page budget + R8 tailor-to-job + R11 application snapshot. Then measure: % resumes passing checklist, % tailored applications, employer open rate.

## 5. Verification & acceptance

- Backend: boot with local `MONGODB_URL`; `POST` creates N resumes per user (no overwrite); `GET /user/:id` returns array; other users' ids → 403; old single-resume doc migrates with `isPrimary`.
- Frontend: `npm run lint` passes; wizard → checklist all-green → Download produces selectable-text PDF whose `pdftotext` output preserves heading order; Designer template shows human-only warning; missing name/email blocks export.
- Content bar (all must hold on a test resume): single column; standard headings; `MMM YYYY` dates; ≥1 number per experience bullet; ≥6 skills; summary ≤400 chars; filename `Name_Role_2026.pdf`.
- Integration: tailored resume created from a job page attaches to the application; employer sees the snapshot; seeker edits afterward don't mutate the submitted copy.
