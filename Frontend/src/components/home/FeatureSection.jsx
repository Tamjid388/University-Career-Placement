import {
  FaSearch,
  FaRegFileAlt,
  FaBriefcase,
  FaCertificate,
} from "react-icons/fa";
import { Link } from "react-router";
import { Heading } from "../shared/Heading";

const features = [
  {
    icon: <FaSearch className="text-2xl text-white" />,
    title: "Smart Job Matching",
    description:
      "AI-powered job recommendations based on your skills and interests",
    to: "/alljobs",
    label: "Browse matched jobs",
  },
  {
    icon: <FaRegFileAlt className="text-2xl text-white" />,
    title: "Resume Builder",
    description:
      "Create professional resumes with AI-powered suggestions and templates",
    to: "/resumebuilder",
    label: "Open the resume builder",
  },
  {
    icon: <FaBriefcase className="text-2xl text-white" />,
    title: "Portfolio Builder",
    description:
      "Showcase your work with a personalized portfolio that highlights your skills and projects",
    to: "/portfolio-builder",
    label: "Open the portfolio builder",
  },
  {
    icon: <FaCertificate className="text-2xl text-white" />,
    title: "Skill Assessment",
    description:
      "Validate your skills with industry-standard assessments and certifications",
    to: "/skill-assessment",
    label: "Open skill assessments",
  },
];

export default function FeatureSection() {
  return (
    <section className="home-section bg-base-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-base-100 to-base-200 opacity-50"></div>
      <div className="home-container text-center relative z-10">
        <Heading
          title="Everything You Need to Succeed"
          subtitle="Comprehensive tools and resources to help you land your dream job"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 md:mt-10">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.to}
              aria-label={feature.label}
              className="home-card p-8 motion-safe:hover:scale-[1.03] hover:shadow-xl text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            >
              <div className="w-16 h-16 mx-auto flex items-center justify-center bg-gradient-to-r from-[#7405de] to-[#a626ec] rounded-full mb-6 shadow-md">
                {feature.icon}
              </div>
              <h3 className="card-title mb-3 text-xl">
                {feature.title}
              </h3>
              <p className="card-body-text text-base">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}