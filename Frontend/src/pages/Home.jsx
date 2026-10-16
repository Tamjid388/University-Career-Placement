import { useEffect } from "react";
import Article from "../components/home/Article.jsx";
import EmployerCta from "../components/home/EmployerCta.jsx";
import FaqSection from "../components/home/FAQ.jsx";
import FeatureSection from "../components/home/FeatureSection.jsx";
import Hero from "../components/home/Hero.jsx";
import PopularJob from "../components/home/PopularJob.jsx";
import SponsorCompany from "../components/home/SponsorCompany.jsx";
import StatsBar from "../components/home/StatsBar.jsx";

const SITE_TITLE = "JobPortal | Find Jobs, Build Resume & Portfolio";
const SITE_DESCRIPTION =
  "Find your dream job with JobPortal. Explore job listings, apply online, build resumes and portfolios, and validate skills.";
const SITE_KEYWORDS =
  "jobs, careers, job portal, job search, employment, hiring, job listings, apply online, career growth, resume builder, portfolio builder, skill assessment";


export const Home = () => {
  useEffect(() => {
    document.title = SITE_TITLE;

    const upsertMeta = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    upsertMeta("description", SITE_DESCRIPTION);
    upsertMeta("keywords", SITE_KEYWORDS);
  }, []);

  return (
    <div className="bg-base-100 text-base-content">
      <Hero />
      <StatsBar />
      <PopularJob />
      <SponsorCompany />
      <Article />
      <FeatureSection />
      <EmployerCta />
      <FaqSection showall={false} />
    </div>
  );
};
