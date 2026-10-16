# Folder Structure (Target — with Zod + Testing)

> Backend keeps its current layered layout. Zod validation and tests are added alongside — no modular rewrite.
> Legend: `NEW` = to be added. Everything else already exists.

## Root

```
University-Career-Placement/
  AGENTS.md
  README.md
  package.json            # root only holds react-responsive; install/run inside Backend/ and Frontend/
  Backend/
  Frontend/
  docs/
    folder-structure.md   # this file
    PRD.md
    levelup.md
    resume-builder-feature-enhancement-2026.md
    resume-standard-for-job-applications-2026.md
  plan/
  .agents/skills/
```

## Backend (target)

```
Backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── database.js
│   │   └── firebaseconfig.js
│   ├── routers/
│   │   ├── index.routes.js
│   │   ├── user.route.js
│   │   ├── company.route.js
│   │   ├── job.route.js
│   │   ├── application.route.js
│   │   ├── admin.route.js
│   │   ├── interview.route.js
│   │   ├── portfolio.route.js
│   │   ├── payment.route.js
│   │   ├── resume.route.js
│   │   ├── skillassesment.route.js
│   │   ├── stat.route.js
│   │   └── bookmark.route.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── firebaseauth.controller.js
│   │   ├── user.controller.js
│   │   ├── company.controller.js
│   │   ├── job.controller.js
│   │   ├── application.controller.js
│   │   ├── admin.controller.js
│   │   ├── interview.controller.js
│   │   ├── portfolio.controller.js
│   │   ├── payment.controller.js
│   │   ├── resumebuilder.controller.js
│   │   ├── skillassesment.controller.js
│   │   ├── stat.controller.js
│   │   └── bookmark.controller.js
│   ├── services/              # NEW — pure business logic, no req/res
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── company.service.js
│   │   ├── job.service.js
│   │   ├── application.service.js
│   │   ├── interview.service.js
│   │   ├── portfolio.service.js
│   │   ├── payment.service.js
│   │   ├── resumebuilder.service.js
│   │   ├── skillassesment.service.js
│   │   ├── bookmark.service.js
│   │   ├── admin.service.js
│   │   └── stat.service.js
│   ├── validations/           # NEW — Zod schemas, one per domain
│   │   ├── auth.schema.js
│   │   ├── user.schema.js
│   │   ├── company.schema.js
│   │   ├── job.schema.js
│   │   ├── application.schema.js
│   │   ├── interview.schema.js
│   │   ├── portfolio.schema.js
│   │   ├── payment.schema.js
│   │   ├── resumebuilder.schema.js
│   │   ├── skillassesment.schema.js
│   │   └── bookmark.schema.js
│   ├── middlewares/
│   │   ├── verifytoken.js
│   │   ├── checkrole.js
│   │   ├── requireemployer.js
│   │   ├── requirejobseeker.js
│   │   ├── validate.js        # NEW — generic (schema) => middleware
│   │   └── errorHandler.js    # NEW — ZodError -> 400
│   ├── models/
│   │   ├── user.model.js
│   │   ├── company.model.js
│   │   ├── job.model.js
│   │   ├── application.model.js
│   │   ├── interview.model.js
│   │   ├── portfolio.model.js
│   │   ├── payment.model.js
│   │   ├── resumebuilder.model.js
│   │   ├── skillassesment.model.js
│   │   └── bookmark.model.js
│   ├── utils/
│   │   ├── generatetoken.js
│   │   ├── mailer.js
│   │   ├── pagination.js
│   │   ├── httpError.js       # NEW — HttpError(statusCode, message)
│   │   └── catchAsync.js      # NEW — async controller wrapper -> next(err)
│   └── seed/
│       ├── seedJobsNext12Months.js
│       ├── seedSkills.js
│       └── setCompanyLogos.js
├── tests/                     # NEW
│   ├── setup/
│   │   ├── database.js        # mongodb-memory-server connect/disconnect
│   │   └── factories.js       # makeUser / makeJob / authCookie helpers
│   ├── unit/
│   │   ├── services/
│   │   │   ├── auth.service.test.js
│   │   │   ├── user.service.test.js
│   │   │   ├── job.service.test.js
│   │   │   └── application.service.test.js
│   │   └── validations/
│   │       ├── auth.schema.test.js
│   │       ├── user.schema.test.js
│   │       ├── job.schema.test.js
│   │       └── application.schema.test.js
│   └── integration/
│       ├── api/
│       │   ├── auth.test.js
│       │   ├── job.test.js
│       │   └── application.test.js
│       └── database/
│           ├── user.model.test.js
│           └── job.model.test.js
├── vitest.config.js           # NEW
├── package.json
├── .env
└── .gitignore
```

### Backend request flow (target)

```
router -> verifyToken -> checkRole/require* -> validate(zodSchema) -> controller -> service -> model
                                              -> errorHandler (ZodError -> 400)
```

### Backend conventions

* ESM with explicit `.js` extensions on relative imports — keep this style.
* Base path `/api/v1/...` mounted in `src/app.js`. New endpoint = router + controller + service + validation schema + model (if needed) + mount in `app.js` + matching `Frontend/src/api/<domain>.js` function.
* Auth: read user from `req.user` after `verifyToken`; enforce role with existing `checkRole` / `require*` middleware.
* CORS allowlist (`localhost:5173` + prod frontend) with `credentials: true`; frontend keeps `withCredentials: true`.
* Deps: `zod`, `vitest`, `supertest`, `mongodb-memory-server` (all NEW, Backend-local only).

## Frontend (unchanged by this proposal)

```
Frontend/
  .env / .env.production  # VITE_API_BASE_URL (e.g. http://localhost:3000/api/v1)
  index.html
  vite.config.js
  eslint.config.js
  vercel.json
  src/
    main.jsx              # AuthProvider > QueryClientProvider > ProfileProvider > PortfolioProvider > RouterProvider
    App.jsx / App.css / index.css
    router/AppRouter.jsx  # createBrowserRouter; / (MainLayouts) + /dashboard (DashBoardLayout) + /portfolio/:slug; role-prefixed children
    api/                  # per-domain TanStack Query callers over axiosInstance (baseURL=VITE_API_BASE_URL, withCredentials)
      axiosInstance.js
      auth.js / profile.js / jobs.js / company.js / application.js / interview.js
      portfolio.js / resumeBuilder.js / skillAssesment.js / payment.js / bookmark.js
      admin.js / Statistics.js / data.js
    context/
      Authprovider.jsx / ProfileProvider.jsx / PortfolioProvider.jsx / ResumeProvider.jsx
    firebase/firebase.config.js  # hardcoded web config — do not duplicate
    hooks/                # useAuth / useJobs / useCompany / useApplication / useInterview / usePortfolio / useResume / useSkillAssesment / usePayment / useBookmarks / useAdmin / useStatistics / useUpdateProfile
    layouts/
      MainLayouts.jsx / DashBoardLayout.jsx / PortfolioLayout.jsx
    components/
      navbar/ drawer/ sidebars/ drawer/sidebarmenus/  # role sidebars: JobSeeker* / Employer* / Admin*
      home/ jobs/ company/ detailsjob/ dashboard/
      bookmarks/ portfolio/ payments/ privateroute/
      shared/ shared/pagination/ shared/toggle/ ui/ loading/
    features/authentication/  # SignIn / SignUp / EmployerSignIn / EmployerSignUP / GoogleSignIN / OauthGoogleSignin / ForgotPassword / ResetPassword / ChangePassword
    pages/
      Home.jsx / JobListing.jsx / JobDetails.jsx / jobs/ / company/ / empoyoler(CreateJob, CreateCompany) [typo in dirname — match exactly]
      portfolio/ resumebuilder/ skillassesment/ payments/ termsandcondition/ demo/ notfound/
    assets/ utils/ (Constant.js)
```

### Frontend conventions

* No hardcoded backend URLs; use `src/api/axiosInstance.js`.
* Protected pages wrap in `<Privateroute>`.
* Tailwind v4 + DaisyUI v5. Match existing import-path casing exactly (Windows-insensitive, Vercel/Linux-sensitive).
