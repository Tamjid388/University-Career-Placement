import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1", "1.0.0.1"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";

dotenv.config();

// Usage:
//   node src/seed/seedJobsNext12Months.js                  -> seed 12 jobs x 12 months (Oct 2026 - Sep 2027), keep existing
//   node src/seed/seedJobsNext12Months.js --clean          -> delete ALL jobs first, then seed
//   node src/seed/seedJobsNext12Months.js --clean-expired  -> delete jobs with deadline < now first, then seed
//   node src/seed/seedJobsNext12Months.js --months=12 --per-month=12 --start=2026-10

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);

const MONTHS = Number(args.months) || 12;
const PER_MONTH = Number(args.perMonth ?? args["per-month"]) || 12;
// Default start = current month (Oct 2026 per server clock). Format YYYY-MM.
const startArg = args.start || null;

function getStartYearMonth() {
  if (startArg && /^\d{4}-\d{2}$/.test(startArg)) {
    const [y, m] = startArg.split("-").map(Number);
    return { year: y, monthIndex: m - 1 };
  }
  const now = new Date();
  return { year: now.getFullYear(), monthIndex: now.getMonth() };
}

// ---------- New companies to add diversity (created only if name missing) ----------
const NEW_COMPANIES = [
  {
    name: "Dhaka Care Hospital",
    industry: "Healthcare",
    establishment: "2010",
    employees: "100-500",
    country: "Bangladesh",
    location: "Green Road",
    city: "Dhaka",
    contactPersonName: "Dr. Sharmin Akter",
    contactPersonDesignation: "HR Manager",
    contactPersonEmail: "hr@dhakacare.example.com",
    contactPersonMobile: "+8801711000011",
    websiteUrl: "https://dhakacare.example.com",
    description: "Multi-speciality hospital serving Dhaka with modern diagnostics and patient care.",
  },
  {
    name: "FinEdge Bank",
    industry: "Finance & Banking",
    establishment: "2015",
    employees: "100-500",
    country: "Bangladesh",
    location: "Motijheel C/A",
    city: "Dhaka",
    contactPersonName: "Tanvir Hasan",
    contactPersonDesignation: "Head of Talent",
    contactPersonEmail: "careers@finedge.example.com",
    contactPersonMobile: "+8801711000022",
    websiteUrl: "https://finedge.example.com",
    description: "Digital-first commercial bank focused on SME lending and mobile banking.",
  },
  {
    name: "TextileCraft Manufacturing",
    industry: "Manufacturing",
    establishment: "2008",
    employees: "100-500",
    country: "Bangladesh",
    location: "Gazipur",
    city: "Gazipur",
    contactPersonName: "Nasir Uddin",
    contactPersonDesignation: "Admin Manager",
    contactPersonEmail: "jobs@textilecraft.example.com",
    contactPersonMobile: "+8801711000033",
    description: "RMG and textile manufacturer exporting to EU and US markets.",
  },
  {
    name: "ShopDhaka Retail",
    industry: "Retail & E-commerce",
    establishment: "2019",
    employees: "51-100",
    country: "Bangladesh",
    location: "Banani",
    city: "Dhaka",
    contactPersonName: "Priya Saha",
    contactPersonDesignation: "People Ops Lead",
    contactPersonEmail: "hiring@shopdhaka.example.com",
    contactPersonMobile: "+8801711000044",
    websiteUrl: "https://shopdhaka.example.com",
    description: "Omnichannel retail and e-commerce brand with 12 outlets and a growing online store.",
  },
  {
    name: "SkyNet Telecom",
    industry: "Telecommunications",
    establishment: "2012",
    employees: "100-500",
    country: "Bangladesh",
    location: "Gulshan",
    city: "Dhaka",
    contactPersonName: "Arif Chowdhury",
    contactPersonDesignation: "HR Business Partner",
    contactPersonEmail: "talent@skynet-tel.example.com",
    contactPersonMobile: "+8801711000055",
    description: "Nationwide ISP and telecom infrastructure provider.",
  },
  {
    name: "CineBuzz Media",
    industry: "Media & Entertainment",
    establishment: "2017",
    employees: "26-50",
    country: "Bangladesh",
    location: "Dhanmondi",
    city: "Dhaka",
    contactPersonName: "Nabila Karim",
    contactPersonDesignation: "Creative Producer",
    contactPersonEmail: "hello@cinebuzz.example.com",
    contactPersonMobile: "+8801711000066",
    description: "Digital media house producing video content, OTT shows and branded stories.",
  },
  {
    name: "Padma Hospitality Group",
    industry: "Hospitality & Tourism",
    establishment: "2014",
    employees: "100-500",
    country: "Bangladesh",
    location: "Cox's Bazar",
    city: "Cox's Bazar",
    contactPersonName: "Rashed Khan",
    contactPersonDesignation: "Resort HR Manager",
    contactPersonEmail: "careers@padmahospitality.example.com",
    contactPersonMobile: "+8801711000077",
    description: "Hotel and resort chain operating beach resorts and city hotels.",
  },
  {
    name: "LogiTrack Solutions",
    industry: "Transportation & Logistics",
    establishment: "2016",
    employees: "51-100",
    country: "Bangladesh",
    location: "Chattogram Port Area",
    city: "Chattogram",
    contactPersonName: "Fahim Reza",
    contactPersonDesignation: "Operations HR",
    contactPersonEmail: "jobs@logitrack.example.com",
    contactPersonMobile: "+8801711000088",
    description: "Tech-enabled freight, warehousing and last-mile delivery company.",
  },
  {
    name: "BioPharma Labs",
    industry: "Biotechnology & Pharmaceuticals",
    establishment: "2011",
    employees: "100-500",
    country: "Bangladesh",
    location: "Tongi",
    city: "Gazipur",
    contactPersonName: "Dr. Mahmudul Islam",
    contactPersonDesignation: "HR Director",
    contactPersonEmail: "hr@biopharma-labs.example.com",
    contactPersonMobile: "+8801711000099",
    description: "WHO-GMP certified pharma manufacturer with R&D labs.",
  },
  {
    name: "CloudKite Software",
    industry: "Software",
    establishment: "2020",
    employees: "51-100",
    country: "Bangladesh",
    location: "Mohakhali DOHS",
    city: "Dhaka",
    contactPersonName: "Sadia Afrin",
    contactPersonDesignation: "Engineering Manager",
    contactPersonEmail: "hiring@cloudkite.example.com",
    contactPersonMobile: "+8801711000100",
    websiteUrl: "https://cloudkite.example.com",
    description: "B2B SaaS studio building HR, ERP and analytics products for local and global clients.",
  },
];

// ---------- Role templates (industry-aligned) ----------
const ROLE_TEMPLATES = [
  { industry: "Information Technology", title: "Frontend Developer (React)", skills: ["JavaScript", "React", "Tailwind CSS", "REST APIs"], level: "Mid", salary: [60000, 100000], jobType: "full-time", shift: "Day", education: "B.Sc in CSE" },
  { industry: "Information Technology", title: "Backend Developer (Node.js)", skills: ["Node.js", "Express", "MongoDB", "REST APIs"], level: "Mid", salary: [70000, 120000], jobType: "full-time", shift: "Day", education: "B.Sc in CSE" },
  { industry: "Information Technology", title: "Junior QA Engineer", skills: ["Manual Testing", "Postman", "Bug Reporting"], level: "Entry", salary: [35000, 55000], jobType: "full-time", shift: "Day", education: "B.Sc in CSE" },
  { industry: "Information Technology", title: "DevOps Intern", skills: ["Linux", "Git", "Docker Basics"], level: "Entry", salary: [20000, 35000], jobType: "internship", shift: "Flexible", education: "Running B.Sc in CSE" },
  { industry: "Software", title: "Full-Stack Developer (MERN)", skills: ["MongoDB", "Express", "React", "Node.js"], level: "Mid", salary: [80000, 130000], jobType: "full-time", shift: "Day", education: "B.Sc in Software Engineering" },
  { industry: "Software", title: "Mobile App Developer (Flutter)", skills: ["Flutter", "Dart", "Firebase"], level: "Mid", salary: [70000, 110000], jobType: "full-time", shift: "Day", education: "B.Sc in CSE" },
  { industry: "Software", title: "UI/UX Designer", skills: ["Figma", "Wireframing", "Prototyping"], level: "Mid", salary: [55000, 90000], jobType: "full-time", shift: "Flexible", education: "Bachelor in Design" },
  { industry: "Software", title: "Technical Support Engineer", skills: ["Customer Support", "SQL Basics", "Troubleshooting"], level: "Entry", salary: [30000, 50000], jobType: "full-time", shift: "Rotational", education: "Diploma / B.Sc" },
  { industry: "Healthcare", title: "Staff Nurse", skills: ["Patient Care", "Emergency Response", "Record Keeping"], level: "Entry", salary: [30000, 50000], jobType: "full-time", shift: "Rotational", education: "B.Sc in Nursing" },
  { industry: "Healthcare", title: "Medical Officer", skills: ["Diagnosis", "Prescription", "Emergency Care"], level: "Mid", salary: [70000, 110000], jobType: "full-time", shift: "Rotational", education: "MBBS" },
  { industry: "Healthcare", title: "Lab Technologist", skills: ["Pathology", "Sample Collection", "Lab Equipment"], level: "Entry", salary: [28000, 45000], jobType: "full-time", shift: "Day", education: "Diploma in Lab Technology" },
  { industry: "Finance & Banking", title: "Relationship Officer (SME)", skills: ["Client Acquisition", "Loan Processing", "KYC"], level: "Entry", salary: [35000, 60000], jobType: "full-time", shift: "Day", education: "BBA / MBA" },
  { industry: "Finance & Banking", title: "Financial Analyst", skills: ["Excel", "Financial Modeling", "Reporting"], level: "Mid", salary: [60000, 100000], jobType: "full-time", shift: "Day", education: "BBA in Finance" },
  { industry: "Finance & Banking", title: "Branch Teller (Contract)", skills: ["Cash Handling", "Customer Service"], level: "Entry", salary: [28000, 40000], jobType: "contract", shift: "Day", education: "Bachelor degree" },
  { industry: "Education", title: "Lecturer - Computer Science", skills: ["Teaching", "Curriculum Design", "Mentoring"], level: "Mid", salary: [50000, 80000], jobType: "full-time", shift: "Day", education: "M.Sc in CSE" },
  { industry: "Education", title: "English Language Instructor", skills: ["IELTS Coaching", "Lesson Planning"], level: "Entry", salary: [30000, 50000], jobType: "part-time", shift: "Flexible", education: "B.A in English" },
  { industry: "Education", title: "Admissions Counselor", skills: ["Counseling", "CRM", "Communication"], level: "Entry", salary: [28000, 45000], jobType: "full-time", shift: "Day", education: "Bachelor degree" },
  { industry: "Manufacturing", title: "Production Supervisor", skills: ["Line Management", "Quality Control", "Scheduling"], level: "Mid", salary: [45000, 70000], jobType: "full-time", shift: "Day", education: "B.Sc in IPE / Textile" },
  { industry: "Manufacturing", title: "Quality Assurance Officer", skills: ["AQL", "Inspection", "Compliance"], level: "Entry", salary: [30000, 50000], jobType: "full-time", shift: "Day", education: "B.Sc / Diploma" },
  { industry: "Manufacturing", title: "Machine Operator (Contract)", skills: ["Machine Handling", "Safety Compliance"], level: "Entry", salary: [22000, 32000], jobType: "contract", shift: "Rotational", education: "HSC / Vocational" },
  { industry: "Retail & E-commerce", title: "E-commerce Executive", skills: ["Daraz/Shopify", "Order Management", "Excel"], level: "Entry", salary: [28000, 45000], jobType: "full-time", shift: "Day", education: "Bachelor degree" },
  { industry: "Retail & E-commerce", title: "Store Sales Associate", skills: ["Sales", "Customer Service", "POS"], level: "Entry", salary: [20000, 30000], jobType: "full-time", shift: "Rotational", education: "HSC" },
  { industry: "Retail & E-commerce", title: "Digital Marketing Specialist", skills: ["Facebook Ads", "SEO", "Content"], level: "Mid", salary: [45000, 75000], jobType: "full-time", shift: "Day", education: "BBA in Marketing" },
  { industry: "Telecommunications", title: "Network Support Engineer", skills: ["TCP/IP", "Fiber Optics", "Troubleshooting"], level: "Entry", salary: [35000, 60000], jobType: "full-time", shift: "Rotational", education: "B.Sc in EEE / CSE" },
  { industry: "Telecommunications", title: "Field Technician (Contract)", skills: ["Installation", "Maintenance", "Safety"], level: "Entry", salary: [25000, 38000], jobType: "contract", shift: "Day", education: "Diploma in EEE" },
  { industry: "Media & Entertainment", title: "Video Editor", skills: ["Premiere Pro", "After Effects", "Storytelling"], level: "Mid", salary: [40000, 70000], jobType: "full-time", shift: "Flexible", education: "Bachelor degree" },
  { industry: "Media & Entertainment", title: "Content Writer (Social Media)", skills: ["Copywriting", "Bangla & English", "Trends"], level: "Entry", salary: [25000, 45000], jobType: "part-time", shift: "Remote", education: "Bachelor degree" },
  { industry: "Hospitality & Tourism", title: "Front Desk Officer", skills: ["Guest Handling", "Reservation Systems", "English"], level: "Entry", salary: [25000, 40000], jobType: "full-time", shift: "Rotational", education: "Diploma in Hotel Management" },
  { industry: "Hospitality & Tourism", title: "Tour Package Executive", skills: ["Itinerary Planning", "Vendor Management", "Sales"], level: "Entry", salary: [28000, 45000], jobType: "full-time", shift: "Day", education: "Bachelor degree" },
  { industry: "Real Estate", title: "Property Sales Executive", skills: ["Lead Generation", "Site Visits", "Negotiation"], level: "Entry", salary: [30000, 55000], jobType: "full-time", shift: "Day", education: "Bachelor degree" },
  { industry: "Real Estate", title: "Site Engineer", skills: ["AutoCAD", "Supervision", "Estimation"], level: "Mid", salary: [50000, 80000], jobType: "full-time", shift: "Day", education: "B.Sc in Civil" },
  { industry: "Transportation & Logistics", title: "Delivery Operations Executive", skills: ["Route Planning", "Fleet Coordination"], level: "Entry", salary: [30000, 48000], jobType: "full-time", shift: "Day", education: "Bachelor degree" },
  { industry: "Transportation & Logistics", title: "Warehouse Supervisor", skills: ["Inventory", "WMS", "Team Leadership"], level: "Mid", salary: [40000, 65000], jobType: "full-time", shift: "Rotational", education: "Bachelor degree" },
  { industry: "Biotechnology & Pharmaceuticals", title: "QC Chemist", skills: ["HPLC", "GMP", "Documentation"], level: "Entry", salary: [35000, 60000], jobType: "full-time", shift: "Day", education: "B.Sc in Chemistry / Pharmacy" },
  { industry: "Biotechnology & Pharmaceuticals", title: "Medical Promotion Officer", skills: ["Doctor Visits", "Product Detailing", "Territory Sales"], level: "Entry", salary: [30000, 50000], jobType: "full-time", shift: "Day", education: "B.Sc / B.Pharm" },
  { industry: "Information Technology", title: "Cybersecurity Analyst", skills: ["SIEM", "Vulnerability Assessment", "Firewalls"], level: "Mid", salary: [80000, 130000], jobType: "full-time", shift: "Day", education: "B.Sc in CSE / Security certs" },
  { industry: "Software", title: "Data Analyst (Power BI)", skills: ["SQL", "Power BI", "Excel"], level: "Mid", salary: [60000, 95000], jobType: "full-time", shift: "Day", education: "B.Sc in CSE / Statistics" },
  { industry: "Education", title: "Career Placement Officer", skills: ["Employer Relations", "Event Management", "Counseling"], level: "Mid", salary: [45000, 70000], jobType: "full-time", shift: "Day", education: "MBA / Masters" },
];

const LOCATIONS = [
  { city: "Dhaka", location: "Gulshan, Dhaka", country: "Bangladesh" },
  { city: "Dhaka", location: "Banani, Dhaka", country: "Bangladesh" },
  { city: "Dhaka", location: "Uttara, Dhaka", country: "Bangladesh" },
  { city: "Dhaka", location: "Mirpur, Dhaka", country: "Bangladesh" },
  { city: "Dhaka", location: "Dhanmondi, Dhaka", country: "Bangladesh" },
  { city: "Chattogram", location: "GEC Circle, Chattogram", country: "Bangladesh" },
  { city: "Sylhet", location: "Zindabazar, Sylhet", country: "Bangladesh" },
  { city: "Gazipur", location: "Tongi, Gazipur", country: "Bangladesh" },
  { city: "Cox's Bazar", location: "Marine Drive, Cox's Bazar", country: "Bangladesh" },
  { city: "Dhaka", location: "Remote (Work from home)", country: "Bangladesh" },
];

function pick(arr, n) {
  return arr[n % arr.length];
}

function buildDescription(t, companyName, city) {
  return (
    `${companyName} is hiring a ${t.title} in ${city}.\n\n` +
    `Role: ${t.title} (${t.level} level, ${t.jobType}).\n` +
    `Key skills: ${t.skills.join(", ")}.\n\n` +
    `Responsibilities:\n` +
    `- Deliver day-to-day ${t.title.toLowerCase()} duties to a high standard\n` +
    `- Collaborate with the team and report progress weekly\n` +
    `- Follow company process, quality and safety guidelines\n\n` +
    `Requirements:\n` +
    `- ${t.education}\n` +
    `- Hands-on experience with ${t.skills.slice(0, 3).join(", ")}\n` +
    `- Good communication in Bangla and English\n\n` +
    `We offer a friendly work environment, festival bonuses, and yearly salary review.`
  );
}

async function main() {
  const { year: startYear, monthIndex: startMonth } = getStartYearMonth();
  const startLabel = `${startYear}-${String(startMonth + 1).padStart(2, "0")}`;

  if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL missing in .env");

  await mongoose.connect(process.env.MONGODB_URL);
  console.log(`Connected. Seeding ${MONTHS} months x ${PER_MONTH}/month starting ${startLabel}`);

  if (args.clean) {
    const r = await Job.deleteMany({});
    console.log(`--clean: deleted ${r.deletedCount} existing jobs`);
  } else if (args["clean-expired"]) {
    const r = await Job.deleteMany({ deadline: { $lt: new Date() } });
    console.log(`--clean-expired: deleted ${r.deletedCount} expired jobs`);
  }

  // Employers to own any new companies
  const employers = await User.find({ role: "employer" }).select("_id");
  if (employers.length === 0) throw new Error("No employer users found - create at least one employer first");
  let empIdx = 0;

  // Ensure new companies exist (idempotent by name)
  let createdCompanies = 0;
  for (const c of NEW_COMPANIES) {
    const exists = await Company.findOne({ name: c.name });
    if (!exists) {
      const owner = employers[empIdx % employers.length];
      empIdx += 1;
      await Company.create({ ...c, trusted: "notverified", createdBy: owner._id });
      createdCompanies += 1;
    }
  }
  console.log(`New companies created: ${createdCompanies} (total companies: ${await Company.countDocuments()})`);

  // Load all companies with owners for job attribution
  const companies = await Company.find().select("_id name industry city country location createdBy");
  if (companies.length === 0) throw new Error("No companies found");

  // Group companies by industry for industry-matched assignment
  const byIndustry = new Map();
  for (const c of companies) {
    if (!byIndustry.has(c.industry)) byIndustry.set(c.industry, []);
    byIndustry.get(c.industry).push(c);
  }
  const fallbackCompanies = companies;

  const docs = [];
  let globalIdx = 0;

  for (let m = 0; m < MONTHS; m++) {
    const d = new Date(startYear, startMonth + m, 1);
    const y = d.getFullYear();
    const mo = d.getMonth(); // 0-based
    const daysInMonth = new Date(y, mo + 1, 0).getDate();

    for (let i = 0; i < PER_MONTH; i++) {
      const template = ROLE_TEMPLATES[(m * PER_MONTH + i) % ROLE_TEMPLATES.length];

      // Prefer a company whose industry matches the template
      const pool = byIndustry.get(template.industry) ?? fallbackCompanies;
      const company = pool[(m * PER_MONTH + i) % pool.length];

      // Spread createdAt across the month: days 2..27 deterministic
      const day = 2 + ((i * 2 + m) % Math.min(26, daysInMonth - 2));
      const hour = 9 + ((globalIdx * 37) % 9); // 09:00-17:00
      const createdAt = new Date(y, mo, day, hour, 15, 0);

      // Deadline 21-30 days after posting (stays in the future relative to posting)
      const deadline = new Date(createdAt);
      deadline.setDate(deadline.getDate() + 21 + ((globalIdx * 13) % 10));

      const loc = pick(LOCATIONS, globalIdx * 7 + m);
      const vacancy = String(1 + ((globalIdx * 5 + m) % 5)); // "1".."5"
      const minExp = template.level === "Entry" ? 0 + ((globalIdx + m) % 2) : 2 + ((globalIdx + m) % 4);
      const shift = template.shift ?? (globalIdx % 3 === 0 ? "Remote" : "Day");

      docs.push({
        title: template.title,
        vacancy,
        description: buildDescription(template, company.name, loc.city),
        company: company._id,
        postedBy: company.createdBy,
        country: loc.country,
        location: loc.location,
        city: loc.city,
        jobType: template.jobType,
        deadline,
        skillsRequired: template.skills,
        industry: template.industry,
        salaryRange: { min: template.salary[0], max: template.salary[1] },
        salaryType: "Monthly",
        currency: "BDT",
        isNegotiable: globalIdx % 4 === 0,
        jobLevel: template.level,
        jobShift: shift,
        gender: "Any",
        minEducationLevel: template.education,
        minExperience: minExp,
        maxExperience: minExp + 2,
        jobRequirements: `Must have ${template.skills.slice(0, 2).join(" and ")} skills. ${template.education} required.`,
        status: "approved", // visible on the public job board
        createdAt,
        updatedAt: createdAt,
      });

      globalIdx += 1;
    }
  }

  const inserted = await Job.insertMany(docs, { ordered: false });
  console.log(`Inserted ${inserted.length} jobs`);

  // Per-month verification (local YYYY-MM label; range uses the same local boundaries as seeding)
  for (let m = 0; m < MONTHS; m++) {
    const d = new Date(startYear, startMonth + m, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const count = await Job.countDocuments({ createdAt: { $gte: start, $lt: end } });
    const label = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;
    console.log(`  ${label}: ${count} jobs`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch(async (e) => {
  console.error(e);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
