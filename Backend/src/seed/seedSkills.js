import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1", "1.0.0.1"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  SkillAssessment,
  SkillAssessmentQuestions,
} from "../models/skillassesment.model.js";

dotenv.config();

// Usage:
//   npm run seed:skills                  -> add missing skills + one assessment each, keep existing
//   npm run seed:skills -- --clean       -> delete ALL skills + assessments first, then seed
//
// Shows up on http://localhost:5173/skill-assessment (GET /api/v1/skillAssesment)

const args = process.argv.slice(2);
const CLEAN = args.includes("--clean");

// ---------- helpers to keep question definitions compact ----------
const mcq = (text, correct, distractors, explanation = "", points = 1) => ({
  text,
  type: "MCQ",
  points,
  explanation,
  options: [
    { text: correct, is_correct: true },
    ...distractors.map((d) => ({ text: d, is_correct: false })),
  ],
});

const tf = (text, answerTrue, explanation = "", points = 1) => ({
  text,
  type: "TrueFalse",
  points,
  explanation,
  options: [
    { text: "True", is_correct: answerTrue === true },
    { text: "False", is_correct: answerTrue === false },
  ],
});

const multi = (text, corrects, wrongs, explanation = "", points = 2) => ({
  text,
  type: "Multiple",
  points,
  explanation,
  options: [
    ...corrects.map((c) => ({ text: c, is_correct: true })),
    ...wrongs.map((w) => ({ text: w, is_correct: false })),
  ],
});

// ---------- skills to seed (shown on /skill-assessment) ----------
const SKILLS = [
  {
    name: "JavaScript Fundamentals",
    category: "Programming",
    description: "Variables, functions, arrays, objects and ES6 basics every web developer must know.",
    difficulty: "Beginner",
    icon_url: "https://img.icons8.com/?size=96&id=108784&format=png",
  },
  {
    name: "React.js",
    category: "Programming",
    description: "Components, props, state, hooks and routing in modern React.",
    difficulty: "Intermediate",
    icon_url: "https://img.icons8.com/?size=96&id=12346&format=png",
  },
  {
    name: "Node.js & Express",
    category: "Programming",
    description: "Server-side JavaScript, REST APIs, middleware and routing with Express.",
    difficulty: "Intermediate",
    icon_url: "https://img.icons8.com/?size=96&id=hsPbhk4KVJO7&format=png",
  },
  {
    name: "Python Basics",
    category: "Programming",
    description: "Syntax, data types, loops, functions and file handling in Python.",
    difficulty: "Beginner",
    icon_url: "https://img.icons8.com/?size=96&id=13441&format=png",
  },
  {
    name: "SQL & Databases",
    category: "Data",
    description: "SELECT queries, JOINs, aggregation, indexes and basic schema design.",
    difficulty: "Intermediate",
    icon_url: "https://img.icons8.com/?size=96&id=UFXRpPFebwa2&format=png",
  },
  {
    name: "Data Analysis with Excel",
    category: "Data",
    description: "Cleaning, pivot tables, charts, VLOOKUP/XLOOKUP and dashboards.",
    difficulty: "Beginner",
    icon_url: "https://img.icons8.com/?size=96&id=117561&format=png",
  },
  {
    name: "UI/UX with Figma",
    category: "Design",
    description: "Wireframes, auto-layout, components, prototyping and design handoff.",
    difficulty: "Beginner",
    icon_url: "https://img.icons8.com/?size=96&id=zfHRZ6i1Wg0U&format=png",
  },
  {
    name: "Digital Marketing & SEO",
    category: "Marketing",
    description: "SEO, social media, email basics, analytics and ad fundamentals.",
    difficulty: "Beginner",
    icon_url: "https://img.icons8.com/?size=96&id=13678&format=png",
  },
  {
    name: "English Communication",
    category: "Language",
    description: "Grammar, vocabulary, email writing and interview communication.",
    difficulty: "Beginner",
    icon_url: "https://img.icons8.com/?size=96&id=14099&format=png",
  },
  {
    name: "Cybersecurity Basics",
    category: "Security",
    description: "Passwords, phishing, malware, network basics and safe browsing.",
    difficulty: "Advanced",
    icon_url: "https://img.icons8.com/?size=96&id=6708&format=png",
  },
  {
    name: "Git & GitHub",
    category: "Tools",
    description: "Commits, branches, merging, pull requests and resolving conflicts.",
    difficulty: "Beginner",
    icon_url: "https://img.icons8.com/?size=96&id=12599&format=png",
  },
  {
    name: "Machine Learning Basics",
    category: "Data",
    description: "Supervised vs unsupervised learning, overfitting, metrics and scikit-learn flow.",
    difficulty: "Advanced",
    icon_url: "https://img.icons8.com/?size=96&id=41470&format=png",
  },
];

// ---------- 8 questions per skill (MCQ / TrueFalse / Multiple mix) ----------
const QUESTION_BANK = {
  "JavaScript Fundamentals": [
    mcq("What is the value of `typeof null` in JavaScript?", "object", ["null", "undefined", "number"], "`typeof null` is famously 'object' (a legacy quirk)."),
    mcq("Which keyword declares a block-scoped variable?", "let", ["var", "dim", "static"], "`let` and `const` are block-scoped; `var` is function-scoped."),
    mcq("Which array method adds an element to the END of an array?", "push()", ["pop()", "shift()", "unshift()"], "`push()` appends; `pop()` removes from the end."),
    mcq("What does `JSON.parse()` do?", "Converts a JSON string into a JS object", ["Converts a JS object into a JSON string", "Parses HTML", "Formats dates"], "Use `JSON.stringify()` for the reverse direction."),
    tf("A `const` variable can be reassigned to a new value.", false, "`const` bindings cannot be reassigned (object contents can still mutate)."),
    tf("`===` compares both value AND type without coercion.", true, "`==` coerces types, `===` does not."),
    multi("Which of these values are FALSY in JavaScript?", ["0", "'' (empty string)", "null"], ["'hello'", "[]"], "`0`, `''`, `null`, `undefined`, `NaN` and `false` are falsy. Empty arrays are truthy!"),
    mcq("What prints 0, 1, 2? `for (let i = 0; i < 3; i++) console.log(i)`", "0, 1, 2", ["1, 2, 3", "0, 1, 2, 3", "3, 2, 1"], "Loop runs while i < 3, starting at 0."),
  ],
  "React.js": [
    mcq("What does `useState()` return?", "An array: [current value, setter function]", ["An object with .value", "Just the setter", "A promise"], "Destructure it: `const [count, setCount] = useState(0)`."),
    mcq("What is JSX?", "A syntax extension that lets you write HTML-like code in JS", ["A database", "A CSS framework", "A testing library"], "JSX compiles to `React.createElement()` calls."),
    mcq("Why do list items need a `key` prop?", "So React can track items efficiently during re-renders", ["For CSS styling", "To make items clickable", "Keys are optional comments"], "Keys must be stable and unique among siblings."),
    mcq("When does `useEffect(() => {...}, [])` run?", "Once after the first render", ["On every render", "Never", "Only on unmount"], "Empty deps = mount only; return a function for cleanup."),
    tf("React state updates may be batched and are not applied synchronously.", true, "Read state after re-render or use functional updates."),
    tf("You may call hooks inside loops and conditions as long as it works.", false, "Only call hooks at the top level of React functions."),
    multi("Which are RULES of hooks?", ["Only call hooks at the top level", "Only call hooks from React functions"], ["Call hooks inside if-blocks", "Call hooks from plain JS utils"], "The linter plugin `eslint-plugin-react-hooks` enforces this."),
    mcq("What is the Virtual DOM?", "A lightweight in-memory copy React diffs before touching the real DOM", ["A separate browser", "A CSS engine", "A build tool"], "Reconciliation minimizes expensive real DOM writes."),
  ],
  "Node.js & Express": [
    mcq("What is the signature of an Express middleware function?", "(req, res, next)", ["(err, data)", "(request)", "(ctx, nextTick)"], "Call `next()` to pass control onward."),
    mcq("Which HTTP status means 'Not Found'?", "404", ["200", "500", "301"], "200 OK, 301 redirect, 500 server error."),
    mcq("Which method defines a GET route in Express?", "app.get(path, handler)", ["app.fetch(path)", "app.route.get()", "server.on('get')"], "`app.post/put/delete/patch` cover the other verbs."),
    mcq("What does `npm init -y` do?", "Scaffolds a package.json with defaults", ["Installs all packages", "Publishes to npm", "Starts the server"], "Then `npm install express` adds the dependency."),
    tf("Node.js uses a single-threaded event loop for I/O concurrency.", true, "CPU-heavy work should move to workers/queues."),
    tf("`require()` and `import` can always be mixed freely in one file.", false, "Mixing CJS and ESM needs care with file extensions and config."),
    multi("Which are valid Express response methods?", ["res.json()", "res.send()", "res.status()"], ["res.queryDB()", "res.renderHTMLFile()"], "`res.status(201).json({...})` is the classic combo."),
    mcq("Where does `app.use(express.json())` belong?", "Before the routes that need parsed JSON bodies", ["After app.listen()", "Inside each controller", "In package.json"], "Middleware order matters in Express."),
  ],
  "Python Basics": [
    mcq("What is the output of `len('hello')`?", "5", ["4", "6", "Error"], "`len()` counts characters."),
    mcq("Which keyword defines a function?", "def", ["func", "define", "lambda only"], "`def greet():` then indented body."),
    mcq("Which data type is MUTABLE?", "list", ["tuple", "string", "int"], "Lists and dicts mutate; tuples/strings do not."),
    mcq("What does `range(3)` produce?", "0, 1, 2", ["1, 2, 3", "0, 1, 2, 3", "3, 2, 1"], "`range(n)` stops before n."),
    tf("Indentation matters in Python and defines code blocks.", true, "Use consistent 4-space indentation."),
    tf("`==` and `is` mean exactly the same thing.", false, "`==` compares value, `is` compares identity."),
    multi("Which are valid Python loop tools?", ["for", "while", "break"], ["repeat-until", "do-while"], "Python has `for/while` plus `break/continue`."),
    mcq("How do you open a file for reading?", "open('a.txt', 'r')", ["open('a.txt', 'write')", "read('a.txt')", "file.open('a.txt')"], "Prefer `with open(...) as f:` so it auto-closes."),
  ],
  "SQL & Databases": [
    mcq("Which clause filters GROUPED rows?", "HAVING", ["WHERE", "ORDER BY", "LIMIT"], "`WHERE` filters raw rows; `HAVING` filters after GROUP BY."),
    mcq("Which JOIN keeps ALL left-table rows?", "LEFT JOIN", ["INNER JOIN", "CROSS JOIN", "SEMI JOIN"], "Unmatched right-side columns become NULL."),
    mcq("What does COUNT(*) count?", "All rows including NULLs", ["Only non-NULL rows", "Distinct values", "Tables"], "Use COUNT(col) to skip NULLs in that column."),
    mcq("Which speeds up lookups on a column?", "An index", ["A view", "A comment", "A backup"], "Indexes speed reads but add write overhead."),
    tf("Primary keys must be unique and cannot contain NULL.", true, "Exactly one PK per table."),
    tf("DROP TABLE and DELETE FROM do the same thing.", false, "DROP removes the table itself; DELETE removes rows."),
    multi("Which are aggregate functions?", ["AVG()", "SUM()", "MAX()"], ["CONCAT()", "LOWER()"], "Aggregates collapse many rows into one value."),
    mcq("How do you sort newest-first on created_at?", "ORDER BY created_at DESC", ["ORDER BY created_at ASC", "GROUP BY created_at", "SORT created_at"], "DESC = descending, ASC = ascending (default)."),
  ],
  "Data Analysis with Excel": [
    mcq("Which function looks up a value in the FIRST column and returns a column to the right?", "VLOOKUP()", ["HLOOKUP()", "SUM()", "CONCAT()"], "XLOOKUP() is the modern, more flexible replacement."),
    mcq("What does a PivotTable do?", "Summarizes data by grouping and aggregating", ["Deletes duplicates only", "Creates macros", "Translates text"], "Drag fields into Rows/Columns/Values to analyze."),
    mcq("Which chart best shows a trend over time?", "Line chart", ["Pie chart", "Donut chart", "Radar chart"], "Pies show part-of-whole, not trends."),
    mcq("What does `$A$1` mean in a formula?", "Absolute reference that won't shift when copied", ["A broken link", "Currency formatting", "A hidden cell"], "Use F4 to toggle reference types."),
    tf("XLOOKUP can look both left and right, unlike VLOOKUP.", true, "XLOOKUP also has built-in if-not-found handling."),
    tf("Merging cells always improves analysis and sorting.", false, "Merged cells break sorts/filters — use Center Across Selection instead."),
    multi("Which help CLEAN data?", ["Remove Duplicates", "Text to Columns", "Find & Replace"], ["WordArt", " Watermark"], "Trim spaces and fix types before pivoting."),
    mcq("Which function counts NON-EMPTY cells?", "COUNTA()", ["COUNTBLANK()", "SUM()", "AVERAGE()"], "COUNT() only counts numbers."),
  ],
  "UI/UX with Figma": [
    mcq("What is auto-layout best for?", "Responsive frames that adapt to content", ["Exporting video", "Version control", "Writing code"], "Set direction, padding and gap like flexbox."),
    mcq("What is a component variant?", "A reusable element with switchable states (e.g. button sizes)", ["A file backup", "A color profile", "A plugin"], "Variants keep design systems consistent."),
    mcq("What does prototyping connect?", "Frames with interactions to simulate user flow", ["Fonts to colors", "Teams to billing", "APIs to Figma"], "Set triggers like On Click + Smart Animate."),
    mcq("Which handoff info helps developers?", "Spacing, colors, typography and exportable assets", ["Meeting notes", "Invoice PDFs", "Mood boards only"], "Use Inspect + design tokens for clean handoff."),
    tf("Wireframes should be low-detail and focus on layout, not final visuals.", true, "Validate structure before polishing pixels."),
    tf("You should use pure #000 black text on white for best readability.", false, "Very dark grays (e.g. #111–#333) reduce harsh contrast."),
    multi("Which improve accessibility?", ["Sufficient color contrast", "Large tap targets", "Visible focus states"], ["Tiny gray text", "Color-only error cues"], "Aim for WCAG AA contrast minimums."),
    mcq("What is a design system?", "Reusable components, styles and guidelines used across products", ["One marketing banner", "A font license", "A laptop brand"], "Systems scale quality and speed."),
  ],
  "Digital Marketing & SEO": [
    mcq("What does SEO stand for?", "Search Engine Optimization", ["Social Engagement Order", "Sales Efficiency Output", "Server Error Override"], "Goal: rank higher in organic search."),
    mcq("Which is an ON-PAGE SEO factor?", "Title tags and heading structure", ["Backlink outreach", "TV ads", "Office location"], "Off-page = backlinks, reputation, mentions."),
    mcq("What does CTR measure?", "Clicks divided by impressions", ["Sales divided by staff", "Bounces divided by visits", "Likes divided by posts"], "Higher CTR = more compelling titles/snippets."),
    mcq("Which metric means visitors left after one page?", "Bounce rate", ["Conversion rate", "Retention rate", "Open rate"], "High bounce can signal mismatch or UX issues."),
    tf("Buying thousands of cheap backlinks is a safe SEO shortcut.", false, "Spammy links risk Google penalties — earn quality links."),
    tf("UTM parameters help track where campaign traffic comes from.", true, "e.g. utm_source=facebook in your links."),
    multi("Which are organic (unpaid) channels?", ["SEO blog content", "Email newsletter", "YouTube tutorials"], ["Paid search ads", "Sponsored posts"], "Organic compounds; paid stops when spend stops."),
    mcq("What is A/B testing?", "Comparing two versions to see which performs better", ["Testing two budgets", "Hiring two agencies", "Posting twice daily"], "Change one variable at a time for clear reads."),
  ],
  "English Communication": [
    mcq("Choose the correct sentence.", "She has worked here since 2020.", ["She has worked here since three years.", "She have worked here since 2020.", "She is worked here since 2020."], "'Since' + point in time; 'for' + duration."),
    mcq("Which is the most professional email opening?", "Dear Ms. Rahman,", ["Yo,", "Heyyy!!!", "To whom it may concern whoever"], "Use name + concise subject line."),
    mcq("What does 'deadline is tight' mean?", "Little time remains", ["The paper is narrow", "The team is strict", "Fonts are small"], "Common workplace idiom."),
    mcq("Choose the correctly spelled word.", "Calendar", ["Calender (the date chart sense)", "Callender", "Calandar"], "Stationery (paper) vs stationary (still) is another classic."),
    tf("'Their', 'there' and 'they're' are interchangeable.", false, "Possessive / place / they-are — different words."),
    tf("In interviews, the STAR method structures behavioral answers.", true, "Situation, Task, Action, Result."),
    multi("Which make emails clearer?", ["Descriptive subject line", "One ask per email", "Short paragraphs"], ["ALL CAPS SUBJECTS", "Five topics in one mail"], "Close with a clear next step + deadline."),
    mcq("What is a polite way to disagree?", "I see your point, but I have a different view because...", ["You are wrong.", "Whatever.", "No."], "Acknowledge, then add reasoning."),
  ],
  "Cybersecurity Basics": [
    mcq("What is phishing?", "Fake messages tricking you into revealing credentials", ["A fishing hobby", "A firewall brand", "A VPN protocol"], "Check sender, links and urgency cues."),
    mcq("Which password practice is strongest?", "Long unique passphrase + password manager + MFA", ["Reuse one short password", "Use birthdays", "Share via email"], "Length + uniqueness + second factor wins."),
    mcq("What does MFA add?", "An extra verification factor beyond password", ["Faster internet", "More storage", "Free antivirus"], "Authenticator app or key > SMS codes."),
    mcq("Which is a malware type that encrypts files for ransom?", "Ransomware", ["Adware coupon", "Screensaver", "Cookie"], "Backups + patching blunt ransomware."),
    tf("Public Wi-Fi is always safe for banking without a VPN.", false, "Avoid sensitive logins or use VPN + HTTPS."),
    tf("Software updates often patch security vulnerabilities.", true, "Enable auto-updates where possible."),
    multi("Which are social-engineering red flags?", ["Urgent threats + gift-card payment", "Unexpected attachment + password request", "Spoofed sender domain"], ["Calendar invite from your boss you expected", "Newsletter you subscribed to"], "Slow down, verify via a second channel."),
    mcq("What should you do with a suspicious link?", "Hover to inspect, don't click, report it", ["Click to check", "Forward to friends", "Download first"], "Report to IT/security team."),
  ],
  "Git & GitHub": [
    mcq("What does `git clone` do?", "Copies a remote repository to your machine", ["Deletes a repo", "Merges branches", "Deploys to prod"], "Then `git pull` fetches + merges updates."),
    mcq("How do you start tracking a new branch and switch to it?", "git checkout -b feature-x", ["git branch delete", "git init --force", "git push --delete"], "Modern alt: `git switch -c feature-x`."),
    mcq("What is a pull request?", "A proposal to merge changes with review + discussion", ["A download button", "A server backup", "A billing invoice"], "CI checks often run on PRs before merge."),
    mcq("What does `git status` show?", "Staged/unstaged/untracked file changes", ["Internet speed", "CPU usage", "Commit passwords"], "Run it constantly — it's your compass."),
    tf("You should commit secrets (.env keys) to GitHub so teammates can use them.", false, "Gitignore secrets; share via vault/env manager."),
    tf("Merge conflicts must be resolved manually before completing the merge.", true, "Edit markers, `git add`, then continue."),
    multi("Which are SAFE collaboration habits?", ["Pull before pushing", "Small focused commits", "Review PRs before merging"], ["Force-push to shared main", "Commit node_modules"], "Keep main green and history readable."),
    mcq("Where does `git push` send commits?", "To the configured remote (e.g. origin on GitHub)", ["To the recycle bin", "To localhost only", "To npm"], "Set upstream once: `git push -u origin branch`."),
  ],
  "Machine Learning Basics": [
    mcq("What is supervised learning?", "Learning from labeled examples (input -> known output)", ["Learning without any data", "Memorizing test answers", "Random guessing"], "E.g. spam vs not-spam emails."),
    mcq("What is overfitting?", "Model memorizes training noise and fails on new data", ["Under-training GPUs", "Too little data storage", "Slow internet"], "Cures: more data, regularization, cross-validation."),
    mcq("Which metric suits imbalanced classification?", "F1-score / PR-AUC", ["Accuracy alone", "R-squared", "MSE"], "Accuracy lies when 99% of rows are one class."),
    mcq("What does train/test split prevent?", "Over-optimistic scores from evaluating on training data", ["Slow training", "Large files", "GPU heat"], "Keep a held-out test set, or use cross-validation."),
    tf("More features always improve a model.", false, "Irrelevant features add noise — select/engineer carefully."),
    tf("Unsupervised learning finds structure without labels (e.g. clustering).", true, "E.g. k-means customer segments."),
    multi("Which reduce overfitting?", ["Cross-validation", "Regularization", "More diverse training data"], ["Memorizing the test set", "Ignoring validation"], "Also: simpler models, early stopping, dropout."),
    mcq("What is the typical scikit-learn flow?", "fit on train -> predict -> evaluate on held-out data", ["predict -> fit -> delete data", "evaluate -> deploy -> train", "shuffle labels first"], "`model.fit(X_train, y_train)` then score."),
  ],
};

async function main() {
  if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL missing in .env");

  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected. Seeding skill assessments...");

  if (CLEAN) {
    const a = await SkillAssessmentQuestions.deleteMany({});
    const s = await SkillAssessment.deleteMany({});
    console.log(`--clean: deleted ${s.deletedCount} skills + ${a.deletedCount} assessments`);
  }

  let skillsCreated = 0;
  let skillsSkipped = 0;
  let assessmentsCreated = 0;
  let assessmentsSkipped = 0;

  for (const skillDef of SKILLS) {
    let skill = await SkillAssessment.findOne({ name: skillDef.name });
    if (!skill) {
      skill = await SkillAssessment.create({ ...skillDef, is_active: true });
      skillsCreated += 1;
      console.log(`+ skill: ${skill.name}`);
    } else {
      skillsSkipped += 1;
    }

    const questions = QUESTION_BANK[skillDef.name] ?? [];
    const title = `${skillDef.name} — Practice Test`;
    const existing = await SkillAssessmentQuestions.findOne({
      skill_id: skill._id,
      title,
    });
    if (existing) {
      assessmentsSkipped += 1;
      continue;
    }

    await SkillAssessmentQuestions.create({
      skill_id: skill._id,
      title,
      description: `Timed practice test for ${skillDef.name}. Answer ${questions.length} mixed questions covering the essentials.`,
      duration_seconds: 900,
      difficulty_level: skillDef.difficulty,
      total_questions: questions.length,
      is_active: true,
      questions,
    });
    assessmentsCreated += 1;
    console.log(`  + assessment: ${title} (${questions.length} questions)`);
  }

  const skillCount = await SkillAssessment.countDocuments();
  const assessmentCount = await SkillAssessmentQuestions.countDocuments();
  console.log("----");
  console.log(`Skills: ${skillCount} total (${skillsCreated} created, ${skillsSkipped} already existed)`);
  console.log(`Assessments: ${assessmentCount} total (${assessmentsCreated} created, ${assessmentsSkipped} already existed)`);

  await mongoose.disconnect();
  console.log("Done. Refresh http://localhost:5173/skill-assessment");
}

main().catch(async (e) => {
  console.error(e);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
