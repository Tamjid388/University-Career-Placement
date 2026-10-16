import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1", "1.0.0.1"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import { Company } from "../models/company.model.js";

dotenv.config();

// Usage:
//   node src/seed/setCompanyLogos.js          -> fill logo/cover only where empty
//   node src/seed/setCompanyLogos.js --force  -> overwrite logo/cover for all listed companies
//
// All photo IDs below were verified (HTTP 200) against images.unsplash.com
// before being added here. Logo = square crop, cover = wide banner crop.

const args = new Set(process.argv.slice(2).map((a) => a.replace(/^--/, "")));
const FORCE = args.has("force");

const logo = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=256&h=256&q=80`;
const cover = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&h=400&q=80`;

// [companyName, logoPhotoId, coverPhotoId]
const MAP = [
  // Information Technology
  ["DevNimbus Ltd.", "1519389950473-47ba0277781c", "1519389950473-47ba0277781c"],
  ["Programming Hero2", "1461749280684-dccba630e2f6", "1461749280684-dccba630e2f6"],
  ["Google", "1551434678-e076c223a692", "1551434678-e076c223a692"],
  ["Java Innovators Ltd.", "1498050108023-c5249f4df085", "1498050108023-c5249f4df085"],
  ["algosoftBd", "1555066931-4365d14bab8c", "1555066931-4365d14bab8c"],
  ["NextGen Labs", "1526374965328-7f61d4dc18c5", "1571171637578-41bc2dd41cd2"],
  ["InnoByte Technologies", "1581091226825-a6a2a5aee158", "1571171637578-41bc2dd41cd2"],
  // Software
  ["CloudKite Software", "1496181133206-80ce9b88a853", "1571171637578-41bc2dd41cd2"],
  // Real Estate
  ["Dottopara LTD", "1560518883-ce09059eeffa", "1560518883-ce09059eeffa"],
  ["BongoDB", "1486406146926-c627a92ad1ab", "1486406146926-c627a92ad1ab"],
  // Education
  ["Educonnect Academy", "1523240795612-9a054b0db644", "1503676260728-1c00da094a0b"],
  // Healthcare
  ["Dhaka Care Hospital", "1576091160550-2173dba999ef", "1579684385127-1ef15d508118"],
  // Finance & Banking
  ["FinEdge Bank", "1611974789855-9c2a0a7236a3", "1554224155-6726b3ff858f"],
  // Manufacturing
  ["TextileCraft Manufacturing", "1504328345606-18bbc8c9d7d1", "1565043666747-69f6646db940"],
  // Retail & E-commerce
  ["ShopDhaka Retail", "1441986300917-64674bd600d8", "1483985988355-763728e1935b"],
  // Telecommunications
  ["SkyNet Telecom", "1558494949-ef010cbdcc31", "1544197150-b99a580bb7a8"],
  // Media & Entertainment
  ["CineBuzz Media", "1485846234645-a62644f84728", "1470229722913-7c0e2dbbafd3"],
  // Hospitality & Tourism
  ["Padma Hospitality Group", "1566073771259-6a8506099945", "1582719508461-905c673771fd"],
  // Transportation & Logistics
  ["LogiTrack Solutions", "1586528116311-ad8dd3c8310d", "1578575437130-527eed3abbec"],
  // Biotechnology & Pharmaceuticals
  ["BioPharma Labs", "1532187863486-abf9dbad1b69", "1579154204601-01588f351e67"],
];

async function main() {
  if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL missing in .env");
  await mongoose.connect(process.env.MONGODB_URL);
  console.log(`Connected. ${FORCE ? "Overwriting" : "Filling missing"} logos/covers.`);

  let updated = 0;
  let skipped = 0;
  for (const [name, logoId, coverId] of MAP) {
    const company = await Company.findOne({ name });
    if (!company) {
      console.log(`  [missing] ${name} - not in DB, skipped`);
      skipped += 1;
      continue;
    }
    const patch = {};
    if (FORCE || !company.logo) patch.logo = logo(logoId);
    if (FORCE || !company.cover) patch.cover = cover(coverId);
    if (Object.keys(patch).length === 0) {
      console.log(`  [kept] ${name} - already has images`);
      skipped += 1;
      continue;
    }
    await Company.updateOne({ _id: company._id }, { $set: patch });
    console.log(`  [updated] ${name}`);
    updated += 1;
  }

  const withLogo = await Company.countDocuments({ logo: { $exists: true, $ne: "" } });
  const total = await Company.countDocuments();
  console.log(`Done. updated=${updated} skipped=${skipped} companies_with_logo=${withLogo}/${total}`);
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  try {
    await mongoose.disconnect();
  } catch {}
  process.exit(1);
});
