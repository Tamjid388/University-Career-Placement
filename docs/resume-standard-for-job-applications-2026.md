# Resume Standard for Job Applications (2026)

> Who this is for: jobseekers (mostly students / freshers) applying to jobs on this portal, plus employers judging what "complete" means.
> Not this doc: builder UI/UX upgrades — those live in `docs/resume-builder-feature-enhancement-2026.md`. This doc defines **what resume gets you shortlisted in 2026**, whichever tool made it.
> How applying works here today (verified): `ApplyJob.jsx:25-36` sends `{ jobId, resume: <Cloudinary URL>, coverLetter }` → `applyToJob` (`application.controller.js:28-64`) stores it as `Application.resume: String` (`application.model.js:9`) with one application per job (`{ job:1, applicant:1 }` unique). The modal only checks "a file was uploaded" (`ApplyJob.jsx:26-29`) — **no content check happens today**. This standard is the bar applicants should self-enforce until the platform enforces §11.

## 1. The 2026 bar in 60 seconds

In 2026 your resume is read in this order: **ATS parser → AI ranker → human (6–10 sec skim)**. A resume that fails step 1 never reaches step 3.

| Rule | Standard |
|------|----------|
| Length | 1 page if <5 years experience; max 2 pages otherwise |
| File | Selectable-text PDF (preferred) or clean DOCX; never scanned image / Canva-JPG-export / password-protected |
| Layout | Single column, standard headings, black text, 10.5–12pt, no tables / text-boxes / headers-footers / graphics-as-text |
| Filename | `YourName_TargetRole_2026.pdf` (e.g. `Tamjid_Hasan_Frontend_Intern_2026.pdf`), never `resume(3).pdf` |
| Headings | Use exactly: `Professional Summary, Key Skills, Work Experience, Projects, Education, Certifications` (+ `Links`) |
| Dates | `MMM YYYY – MMM YYYY` or `MMM YYYY – Present` everywhere, no gaps left unexplained |
| Content | Target job title at top; JD language mirrored naturally; every bullet has a number (%, $, users, time); AI/tool fluency stated explicitly |
| Proof | LinkedIn + GitHub/portfolio links that actually open and match the resume; certs with issuer + year (+ URL if verifiable) |
| Tailoring | One tailored copy per application — generic mass-apply loses to tailored every time |
| Honesty | Everything verifiable in interview; no fake companies, inflated titles, or invented metrics |

## 2. Format standard (non-negotiable)

1. **PDF with selectable text.** Test: open your PDF, try to select + copy the email line. If you can't, the ATS can't either — re-export.
2. **Single column top-to-bottom.** Multi-column "designer" resumes parse out of order (contact ends up in the footer, skills vanish). Save designer layouts for portfolio sites, not applications.
3. **Contact block on 4 lines max:** Full name (16–18pt) → `City, Country | phone | email` → `linkedin.com/in/you | github.com/you | portfolio link` → `Work authorization line` (e.g. `Dhaka, Bangladesh | Open to on-site / remote`). One email, one phone — both answered.
4. **Fonts/margins:** Helvetica / Arial / Calibri, body 10.5–11.5pt, headings 12–14pt bold, margins 0.5–0.7in. No color-dependent meaning (prints B&W clean).
5. **File size:** <2 MB. `ResumeUpload.jsx` accepts `.pdf,.doc,.docx` — stay inside that; Cloudinary URL must open publicly (test in incognito).

## 3. Section-by-section standard

Order for **freshers / students** (most of this portal): `Target Title → Summary (2–3 lines) → Key Skills (JD-matched) → Projects → Experience (internships/part-time/freelance, if any) → Education → Certifications → Links`.
Order for **experienced (>2 yrs)**: swap Experience above Projects.

### 3.1 Target title line (directly under name)
One line, exact role family: `Frontend Developer (React) | Seeking Intern / Junior Roles`. This is the single highest-weight match signal — never omit it.

### 3.2 Professional Summary — 2–3 lines, 250–400 chars
Formula: `Who + stack + strongest proof + what you want`.
Good: `CS final-year student skilled in React, Node.js and MongoDB. Built 3 MERN apps including a placement portal used by 200+ students. Seeking a frontend intern role.`
Bad: `Hardworking, passionate team player looking for a challenging opportunity to grow my career.` (zero searchable signal.)

### 3.3 Key Skills — 6–12 items, grouped
Group them: `Frontend: React, Tailwind | Backend: Node.js, Express, MongoDB | Tools: Git, Postman, Vercel | AI workflows: Copilot, ChatGPT-assisted debugging`. Include the **exact JD terms** where you genuinely have them (variants count: `React.js = React`). Add one AI-literacy token where true — postings asking for AI skills are sharply up in 2026 and screeners look for it.

### 3.4 Experience / Internships — bullets that score
Each role: `Title — Company, City (MMM YYYY – MMM YYYY)`, then 2–4 bullets in **Action verb + scope + metric + timeframe** form:
- Good: `Built job-search API with pagination + filters; cut response time 40% and supported 10k+ listings.`
- Good: `Led 4-member team shipping placement portal frontend; 200+ student signups in first month.`
- Bad: `Responsible for managing backend work.` / `Helped with various tasks.`
Weak verbs to replace: `responsible for, helped, worked on, various` → `built, shipped, led, cut, grew, automated, reduced`.

### 3.5 Projects — the fresher's experience section
Same bullet formula as §3.4, plus **live link + GitHub link + one-line stack** per project. 2–3 strong projects beat 6 tutorial clones. For each: what it does, your role, metric (users, latency, coverage), stack. Link targets must open — dead links read as dishonesty to both AI cross-checks and humans.

### 3.6 Education
`Degree — Institution, City (MMM YYYY – MMM YYYY or Expected MMM YYYY)`, CGPA only if ≥3.3/4.0 (or local equivalent worth showing), 1 line on relevant coursework if fresher (`Data Structures, DBMS, Web Engineering`). No SSC/HSC details once at university level unless the JD asks.

### 3.7 Certifications
`Name — Issuer (YYYY)` + verification URL where available. One verifiable cert beats four unverifiable ones. Put expiry-sensitive certs (cloud, security) with month + year.

### 3.8 Links
GitHub, LinkedIn, portfolio slug (`/portfolio/:slug`), live demos. Rule: **every link on the resume must resolve and agree with the resume** (dates, titles, tech). Mismatched LinkedIn vs resume is a 2026 auto-doubt trigger.

## 4. Tailoring rule (one job = one copy)

1. Read the JD; highlight title, must-have skills, domain verbs.
2. Duplicate your base resume; set the target-title line to the JD title family.
3. Move the 3 most JD-relevant skills/bullets to the top of their sections; mirror JD wording naturally (never paste the JD paragraph).
4. Cut anything irrelevant to make room — tailoring is mostly deletion.
5. Rename the file per §2 and note which copy went where (today: track manually; platform-side version tracking is specced in the builder-enhancement doc).

## 5. Cover-letter minimum (this portal requires one)

`ApplyJob.jsx` rejects submits without resume + cover letter. Minimum passing cover letter = 4 lines: role + why this company (1 line, specific) + strongest proof with number (1–2 lines) + availability. No generic "I am writing to apply…" filler. 120–180 words.

## 6. Instant-reject list (ATS + human)

- Scanned/image PDF, Canva-graphics text, tables/columns/text-boxes, info trapped in header/footer
- Missing name, email, phone, or location; `location` left as "Location not provided" style filler
- Fake entries (invented companies, degrees, metrics) — background + interview verify
- No numbers anywhere; every bullet starts with "Responsible for"
- One generic resume for 20 roles (wrong title, irrelevant skills on top)
- Dead links, private GitHub linked as "proof", portfolio URL that 404s
- 3+ pages as a fresher; photo, date of birth, NID, religion, blood group (bias-risk fields — drop them)
- Keyword-stuffed white-text / JD-pasted paragraph (parsers + humans both flag it)

## 7. Pre-Apply checklist (run every time before clicking Apply)

- [ ] 1 page (fresher) / ≤2 pages, single column, standard headings
- [ ] Filename `Name_Role_2026.pdf`, <2 MB, text selectable, opens in incognito
- [ ] Target title line matches this job's family
- [ ] Summary ≤400 chars with stack + one metric
- [ ] ≥6 skills including the JD's must-haves (where genuinely held)
- [ ] Every experience/project bullet has a number + timeframe
- [ ] Dates `MMM YYYY`, no unexplained gaps, consistent with LinkedIn
- [ ] All links open and agree with resume; contact lines answered
- [ ] Fresh graduate: ≥2 projects with live + code links
- [ ] Cover letter 120–180 words, company-specific, with one metric
- [ ] Re-read once for spelling of company/role/tech names

## 8. What the platform checks today vs. next

Today: only "file uploaded + cover letter present" (see header). Recommended enforcement path (no code in this doc; build order lives in `resume-builder-feature-enhancement-2026.md`): completeness gate at Apply (contact + title + summary + skills≥6 + dates valid) → ATS checklist score shown in Preview → tailored-copy-per-job → application stores a resume snapshot so later edits don't rewrite submitted history.
