# PRD — Smart Job Placement Portal (University Career Placement)

- **Version:** 1.0 — 2026-10-16
- **Status:** Living doc — reflects current `main` implementation
- **Repo layout:** `Backend/` (Express API) + `Frontend/` (Vite SPA), monorepo, deployed to Vercel
- **Live:** `https://smartjob-clientside.vercel.app/`
- **Related docs:** `docs/resume-builder-feature-enhancement-2026.md`, `docs/resume-standard-for-job-applications-2026.md`, `AGENTS.md`, `README.md`

## 1. Product Overview

### 1.1 Problem
University students struggle with fragmented career prep (resume in one tool, portfolio in another, jobs on Facebook/LinkedIn, interviews over email), employers get noisy/unfiltered applicants, and university admins have no placement analytics.

### 1.2 Solution
Single MERN portal with three roles — **job-seeker (student), employer, admin** — covering the full loop: profile → resume builder → portfolio builder → job search/apply → employer shortlist → interview scheduling → skill verification → featured-job payments → admin moderation + placement statistics.

### 1.3 Goals
1. Students can apply to a relevant job with a tailored resume + public portfolio link in <5 min.
2. Employers can post a job, review applications, and schedule an interview without leaving the dashboard.
3. Admins can approve/reject jobs/companies/users and view placement stats.
4. Monetize via paid featured-job promotion (SSLCommerz).

### 1.4 Non-goals (current scope)
- No ATS scoring, JD-match, or AI resume rewrite in production (specced as roadmap in `docs/resume-builder-feature-enhancement-2026.md`).
- No real-time chat/push; notifications are email via Nodemailer.
- No DOCX export, resume versioning per application, or public resume share links yet.
- No automated test suite (`Backend npm test` is a stub).

## 2. Users & Roles

| Role | How created | Entry points | Core jobs-to-be-done |
|------|-------------|--------------|----------------------|
| **Job-seeker** | `SignUp` (email+password / Firebase Google) | `/SignUp`, `/SignIn`, `/dashboard/jobseekerDashboard`, `/dashboard/jobseekerProfile`, `/dashboard/jobseekerAppliedJob`, `/dashboard/jobseekerMyPortfolio`, `/dashboard/jobseekerManageResume` | Complete profile, build resume(s), build portfolio, browse/search/apply jobs, take skill assessments, track applications |
| **Employer** | `EmployerSignUP` (creates User + Company), `EmployerSignIn` | `/employer-create-company`, `/employer-signIn`, `/create-job`, `/dashboard/employerDashboard`, `/dashboard/employer/postedJobs`, `/dashboard/employer/managecompany`, `/dashboard/employer/applications`, `/dashboard/employer/interview` | Create/manage company, post/manage jobs, review Accept/Reject applications, schedule interviews, pay to feature a job |
| **Admin** | Seeded / promoted via `ManageUsers` | `/dashboard/adminDashboard`, `/dashboard/manageCompany`, `/dashboard/manageUsers`, `/dashboard/manageJobs`, `/dashboard/manage-skill-assessment` | Verify companies, approve/reject jobs, manage users/jobs/skills, view statistics |

Auth source of truth: `Backend/src/models/user.model.js` (`role: job-seeker | employer | admin`), JWT in `token` cookie + Firebase Admin for Google flow. Guards: `verifytoken.js`, `checkrole.js`, `requireemployer.js`, `requirejobseeker.js`. Frontend guard: `<Privateroute>`.

## 3. Tech Stack

### 3.1 Backend (`Backend/package.json`, ESM `"type": "module"`)
- **Runtime/framework:** Node.js + Express `^4.21.2` (`src/app.js`, `src/server.js`)
- **DB/ODM:** MongoDB + Mongoose `^8.13.2` (`src/config/database.js`, `src/models/`)
- **Auth:** `jsonwebtoken ^9.0.2` + `bcryptjs ^3.0.2` + `cookie-parser ^1.4.7`; Firebase Admin `^13.2.0` + `firebase ^11.6.0` for Google login (`controllers/firebaseauth.controller.js`, `config/firebaseconfig.js`); `arctic ^3.7.0` (OAuth helpers)
- **Middleware/utils:** `cors ^2.8.5` (allowlist localhost:5173 + prod frontend, `credentials:true`), `dotenv ^16.4.7`, `body-parser ^1.20.3`, `multer ^1.4.5-lts.2` (file uploads), `nodemailer ^6.10.1` (email via `utils/mailer.js`), `slugify ^1.6.6` (portfolio slugs), `axios ^1.12.2` (SSLCommerz + validation), `googleapis ^146.0.0`
- **Dev/deploy:** `nodemon ^3.1.9`, Vercel (entry `src/server.js`), seeds: `seedJobsNext12Months.js`, `seedSkills.js`, `setCompanyLogos.js`

### 3.2 Frontend (`Frontend/package.json`)
- **Build/app:** Vite `^6.2.0` + React `^18.3.1` + React DOM, React Router `^7.4.0` (`src/router/AppRouter.jsx` — `/` + `/dashboard` + `/portfolio/:slug`)
- **Data:** `@tanstack/react-query ^5.77.2` + `axios ^1.8.4` via shared `src/api/axiosInstance.js` (`baseURL: VITE_API_BASE_URL`, `withCredentials: true`); per-domain `src/api/*.js` (auth, jobs, company, application, interview, portfolio, resumeBuilder, skillAssesment, payment, Statistics, profile, admin)
- **State/context:** `Authprovider`, `ProfileProvider`, `PortfolioProvider`, `ResumeProvider`
- **Styling/UI:** Tailwind CSS `^4.0.15` (`@tailwindcss/vite`) + DaisyUI `^5.0.9`; `framer-motion ^12.23.6`, `lucide-react`, `react-icons`, `swiper ^11`, `recharts ^2.15.4` (dashboards), `lottie-react`, `lightgallery`, `react-responsive`
- **Forms/editors/feedback:** `react-hook-form ^7.54.2`, `react-form-stepper`, `react-quill ^2.0.0` + `quill ^2.0.3`, `react-day-picker`, `date-fns`, `moment`, `react-hot-toast`, `react-toastify`, `sweetalert2`, `react-confetti`, `react-loader-spinner`, `react-loading-skeleton`
- **Resume PDF:** `@react-pdf/renderer ^4.3.1` (client-side `PDFDownloadLink`, 4 PDF templates)
- **Auth client:** `firebase ^11.5.0` (config hardcoded in `src/firebase/firebase.config.js`)
- **Lint:** `eslint .` (react-hooks + react-refresh)

### 3.3 Data & Integrations
- **DB:** MongoDB Atlas (`MONGODB_URL`); Mongoose models: user, company, job, application, interview, portfolio, resumebuilder, skillassesment (Skill + QuestionAns + Attempt), payment
- **Payments:** SSLCommerz sandbox (`STORE_ID`, `STORE_PASSWORD`, `BACKEND_URL`, `FRONTEND_URL`) — `POST /payment`, validate via `validationserverAPI.php`, redirect to `/payment-success|fail|cancel`
- **Email:** Nodemailer (`EMAIL_USER`, `EMAIL_PASS`)
- **Secrets (never commit):** `MONGODB_URL, SECRET, PORT, NODE_ENV, EMAIL_USER, EMAIL_PASS, BACKEND_URL, FRONTEND_URL, STORE_ID, STORE_PASSWORD`; frontend: `VITE_API_BASE_URL` (e.g. `http://localhost:3000/api/v1`)

## 4. Architecture & Conventions

- **API base:** `/api/v1/...` mounted in `Backend/src/app.js:29-56`: `/user /company /job /application /admin /interviews /portfolio /payment /resumebuilder /skillAssesment /statistics`.
- **Backend style:** ESM with explicit `.js` imports; controllers in `src/controllers/`, routers in `src/routers/*.route.js`, `req.user` after `verifyToken`, role gates via existing middleware (don't reimplement).
- **Frontend style:** `createBrowserRouter`; public pages under `MainLayouts`, role pages under `DashBoardLayout` + `<Privateroute>`; never hardcode backend URLs (use `axiosInstance`); match existing path casing exactly (Linux/Vercel is case-sensitive).
- **New endpoint checklist (per AGENTS.md):** router + controller + model (if needed) + mount in `app.js` under `/api/v1/...` + matching `Frontend/src/api/<domain>.js` function.

## 5. Features (by domain)

### F1. Auth & Profile
- Email/password SignUp/SignIn + Firebase Google login; JWT `token` cookie (`secure`/`sameSite=None` in production); logout clears cookie.
- `user.model.js`: name/email/phone/role, skills[], yearsExperience, education[], workExperience[], certifications[], languages[], projects[], address, socialLinks, picture/avatar, `isProfileComplete`.
- Job-seeker profile page (`JobseekerProfile.jsx` + `src/api/profile.js`): edit bio/skills/education/experience/socials.
- Files: `routers/user.route.js`, `controllers/auth.controller.js`, `controllers/user.controller.js`, `controllers/firebaseauth.controller.js`, `features/authentication/`.

### F2. Company Management
- Employer creates company at signup (`EmployerSignUP`); fields (`company.model.js`): name, industry (22-enum), establishment, employees (1-25…100-500), location/city/country, contact person (name/designation/email/mobile), socials/website, description, logo/cover, `trusted: verified|notverified`, `badges: trusted|top-recuiter|regular-recuiter`, `createdBy`.
- Public: `/allcompanies`, `/companydetails/:id`; employer: `EmployerCompany.jsx`; admin: `ManageCompany.jsx` (verify/trust, delete cascades jobs via `pre deleteOne`).
- Files: `routers/company.route.js`, `controllers/company.controller.js`, `src/api/company.js`.

### F3. Job Board
- `job.model.js`: title, vacancy, description, company ref, postedBy ref, location/city/country, jobType (full-time/part-time/internship/contract), deadline, skillsRequired[], industry enum, salaryRange {min,max} + salaryType + currency (BDT default) + isNegotiable, jobLevel, jobShift, gender, education levels, experience/age ranges, jobRequirements, `status: pending|approved|rejected`, timestamps + text/status/postedBy/company indexes.
- Employer: `CreateJob` (`/create-job`, `/dashboard/employer/create-job`), `PostedJobs`; Admin: `ManageJobs.admin.jsx` (approve/reject).
- Seeker/public: `JobsShowAll`, `JobSearchResults` (`/alljobs`, `/job/search-results`), `JobDetails` (`/job/details/:id`), company jobs, interview-FAQ page (`/interview-questions`).
- Files: `routers/job.route.js`, `controllers/job.controller.js`, `src/api/jobs.js`, seed `seedJobsNext12Months.js`.

### F4. Applications
- `application.model.js`: job ref + applicant ref (unique compound → no double-apply), coverLetter, resume (string path/url), `status: Pending|Accepted|Rejected`, timestamps.
- Seeker: apply from job details (`ResumeUpload.jsx` file upload — currently disconnected from Resume Builder), `JobSeekerAppliedJobs`, withdraw/track.
- Employer: `EmployerApplication.jsx` (per-company filter), Accept/Reject → triggers interview shortlist.
- Files: `routers/application.route.js`, `controllers/application.controller.js`, `src/api/application.js`.

### F5. Interviews
- `interview.model.js`: jobId, candidateId, employerId, scheduledAt, mode (Online|Offline), locationOrLink, `status: Scheduled|Completed|Cancelled`.
- Employer: `EmployerShowAllApplication.jsx` (`/dashboard/employer/interview`) — schedule from accepted applications, update/cancel; email notification via Nodemailer.
- Files: `routers/interview.route.js`, `controllers/interview.controller.js`, `src/api/interview.js`.

### F6. Resume Builder
- Wizard (`BuildYourResume.jsx` + `Stepper.jsx`): About → Education → Experience → Skills → Projects → Additional → Preview; state in `ResumeProvider.jsx` + `react-hook-form`; save via `POST /resumebuilder` (`src/api/resumeBuilder.js` → `resumebuilder.controller.js` upsert by `userId`).
- Model (`resumebuilder.model.js`): templateId/templateTitle, about{…summary}, education[], experience[]{company,position,years,description[String]}, skills[]{name,level}, projects[], additional{…}.
- Export: client-side `@react-pdf/renderer` (`ResumePreview.jsx` `PDFDownloadLink`), 4 PDF + 4 HTML templates; manage in `ManageResume.jsx` (`/dashboard/jobseekerManageResume`).
- Known limits (see enhancement doc): single-resume upsert (no versions), no `jobId` linkage, year-only dates, no auth on resume routes, no ATS validator — roadmap in `docs/resume-builder-feature-enhancement-2026.md`.
- Files: `routers/resume.route.js`, `controllers/resumebuilder.controller.js`, `pages/resumebuilder/`.

### F7. Portfolio Builder
- `portfolio.model.js`: user ref, basicInfo{name,title,bio,about,email,phone,location,picture}, skills[] (Beginner→Advanced), projects[]{title,image,description,githubUrl,liveUrl,techStack}, education, experience, certifications, blogs, socialLinks{github,linkedin,leetcode,portfolio}, templateId, unique `slug`.
- Flow: `/portfolio-builder` (landing) → `/select-portfolio-template` → `/selected-template/:id` → `/portfolio-builder/create` (auth) → `/myportfolio` + dashboard `ManagePortfolio` → public `/portfolio/:slug` (`PublicPortfolio.jsx`, `PortfolioLayout.jsx`).
- Files: `routers/portfolio.route.js`, `controllers/portfolio.controller.js`, `src/api/portfolio.js`, `context/PortfolioProvider`.

### F8. Skill Assessments
- Models (`skillassesment.model.js`): `SkillAssessment`{name,category,description,difficulty,icon_url,is_active}, `QuestionAns`{skill_id,title,description,duration_seconds,total_questions,questions[]:{text,type:MCQ|Multiple|TrueFalse|Coding,points,explanation,options[]{text,is_correct}}}, `Attempt`{user_id,assessment_id,answers[],total_score,max_score,percentage,status}.
- Seeker: `/skill-assessment` home → `/skills/:id` (`Assesments.jsx`, auth) → `/quiz-started/questions` (`AllQuestions.jsx`); Admin: `ManageSkillAssessment` CRUD + seeds (`seedSkills.js`).
- Files: `routers/skillassesment.route.js`, `controllers/skillassesment.controller.js`, `src/api/skillAssesment.js`.

### F9. Payments — Featured Jobs (SSLCommerz)
- `payment.model.js`: userId, email, amount, trx_id, `status: pending|success|failed`.
- Flow: `/featured-payment` (`FeaturedPayment.jsx` + `src/api/payment.js`) → `POST /payment` creates pending record + SSLCommerz init (`sandbox.sslcommerz.com/gwprocess/v4/api.php`) → GatewayPageURL → success/fail/cancel callbacks redirect to `/payment-success|/payment-fail|/payment-cancel`.
- Files: `routers/payment.route.js`, `controllers/payment.controller.js`, `components/payments/feauturedjobpayment/`.

### F10. Admin & Statistics
- `routers/admin.route.js` + `controllers/admin.controller.js`: user/company/job moderation (`ManageUsers`, `ManageCompany`, `ManageJobs`).
- `routers/stat.route.js` + `controllers/stat.controller.js` + `src/api/Statistics.js`: placement counts, application funnels, job/company aggregates rendered with Recharts in `AdminDashboardMenu`, `EmployerDashboardMenu`, `JobSeekerDashboardMenu`.

### F11. Public / Content Pages
- `Home`, `BlogDetails` (`/blog/blogdetails/:id`), `ArticleDetails` (`/article/:id`), `AllFaqs` (`/interview-questions`), `TermsAndCondition`, `Demo`, `NotFOund`, company/job listings above. Sidebars per role in `components/drawer/sidebarmenus/` (`JobSeeker*`, `Employer*`, `Admin*`).

## 6. API Surface (all under `/api/v1`)

| Prefix | Router | Key operations |
|--------|--------|----------------|
| `/user` | `user.route.js` | signup/login/logout/me, Firebase login, profile CRUD |
| `/company` | `company.route.js` | create, list, detail, employer-mine, update, delete, verify |
| `/job` | `job.route.js` | create, list/search/paginate, detail, employer-posted, update, delete, approve/reject (admin) |
| `/application` | `application.route.js` | apply (job+applicant unique), my-applications, job-applications (employer), Accept/Reject, delete |
| `/interviews` | `interview.route.js` | schedule, list by employer/candidate/job, update status, cancel |
| `/portfolio` | `portfolio.route.js` | create/upsert, mine, get by slug, update, delete, template select |
| `/resumebuilder` | `resume.route.js` | create/upsert, get by user, update, delete |
| `/skillAssesment` | `skillassesment.route.js` | skills CRUD, assessments CRUD, questions, attempts submit/score |
| `/payment` | `payment.route.js` | create/init, success/fail/cancel callbacks |
| `/admin` | `admin.route.js` | users/companies/jobs management |
| `/statistics` | `stat.route.js` | dashboard aggregates |

## 7. Key User Flows
1. **Seeker apply:** SignUp → complete profile → (Resume Builder + Portfolio Builder) → `/alljobs` → `/job/details/:id` → Apply (cover letter + resume upload) → `/dashboard/jobseekerAppliedJob` → interview email → Skill Assessment (optional proof).
2. **Employer hire:** EmployerSignUP (company) → `/dashboard/employer/create-job` → `postedJobs` → `/dashboard/employer/applications` (Accept/Reject) → `/dashboard/employer/interview` (schedule Online/Offline) → (optional) Featured Payment to boost job.
3. **Admin moderate:** `adminDashboard` stats → `manageUsers` / `manageCompany` (verify) / `manageJobs` (approve → visible publicly) / `manage-skill-assessment`.

## 8. Non-Functional Requirements
- **Auth/security:** JWT httpOnly-ish `token` cookie; `NODE_ENV` branches `secure`/`sameSite`; role middleware on sensitive routes; never commit `.env` / `firebaseServiceAccount.json` (gitignored). Gap: resume routes currently lack `verifyToken` — must fix (see §10).
- **CORS/cookies:** backend allowlist + `credentials:true`; frontend `withCredentials:true` always.
- **UX:** DaisyUI + Tailwind responsive; dashboard per role; toast/confirm (hot-toast/toastify/sweetalert2); skeletons/spinners for loading; form validation via react-hook-form.
- **Data:** Mongoose indexes on hot paths (job text search, application uniqueness, interview scheduling); pagination util (`utils/pagination.js`).
- **Deploy:** Vercel frontend + backend; env-driven `VITE_API_BASE_URL`, `BACKEND_URL`, `FRONTEND_URL`; Windows dev is case-insensitive — verify import casing for Linux builds.
- **Verification:** `npm run lint` (Frontend); boot backend with local `MONGODB_URL` and hit touched route; boot frontend and walk the touched role flow.

## 9. Tech-Stack Summary Table

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend SPA | React 18 + Vite 6 + React Router 7 | `Frontend/` |
| Server state | TanStack Query 5 + axios instance | `src/api/` |
| Styling/charts | Tailwind v4 + DaisyUI v5 + Recharts + Swiper + Framer Motion | dashboards, listings |
| Resume PDF | @react-pdf/renderer (client-side) | 4 templates |
| Backend API | Express 4 + Mongoose 8 + Node | `Backend/src/` |
| Auth | JWT cookie + bcrypt + Firebase Admin + Firebase web | 3 roles |
| Payments | SSLCommerz sandbox | featured jobs |
| Email | Nodemailer | interview/app updates |
| Uploads | Multer | resume files, logos |
| DB | MongoDB (Atlas via `MONGODB_URL`) | 9 models |
| Hosting | Vercel (both tiers) | `src/server.js` entry |

## 10. Roadmap / Known Gaps
1. Resume: auth/ownership fix, multi-resume + `jobId` linkage, `MMM YYYY` dates, ATS checklist, JD tailor flow, application snapshot (full spec in `docs/resume-builder-feature-enhancement-2026.md`).
2. Standardize resume `Heading` whitelist + mark Designer template human-only (spec in `docs/resume-standard-for-job-applications-2026.md`).
3. Connect Resume Builder output to Application (`resumeId` snapshot) — today applications use a separate file upload.
4. Payment hardening: replace hardcoded customer fields, add idempotency/webhook verification, prod SSLCommerz URL.
5. Tests + CI: backend has no tests; add route tests and `npm run lint` gate.
