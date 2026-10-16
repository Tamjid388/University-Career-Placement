import React from "react";
import { Link } from "react-router";
import SearchBar from "./SearchBar.jsx";

const Hero = () => {
  const images = [
    {
      link: "https://res.cloudinary.com/dto6ulc5n/image/upload/v1764508577/fck3vshlix3vlsnzdlx7.jpg",
      alt: "Professional networking at a career fair",
    },
    {
      link: "https://res.cloudinary.com/dto6ulc5n/image/upload/v1746780002/blog1_drqykp.webp",
      alt: "Student preparing resume on laptop",
    },
    {
      link: "https://res.cloudinary.com/dto6ulc5n/image/upload/v1746727398/jobportal_mftoao.webp",
      alt: "Team collaborating in a modern office",
    },
    {
      link: "https://res.cloudinary.com/dto6ulc5n/image/upload/v1746688269/microsoft-edge-6CNB3iD8M4E-unsplash_1_600x400_s8czld.jpg",
      alt: "Graduate celebrating new job opportunity",
    },
  ];
  const fallbackImg =
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=687&auto=format&fit=crop";
  return (
    <section
      id="home-hero"
      className="
        bg-gradient-to-b from-[#F3E8FF] via-[#FFF2FB] to-[#EDE1FF]
        flex items-center
      "
    >
      <div className="home-container flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-16 pt-12 md:pt-16 pb-24 md:pb-32 md:min-h-[85vh]">
        
        {/* Left Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl min-w-0">
          <span
            className="mb-6 inline-flex items-center gap-2 border
             border-purple-600 text-purple-600 text-xs rounded-full px-4 pr-1.5 py-1.5"
          >
            <span className="font-roboto">Find your dream job today</span>
            <span className="flex items-center justify-center size-6 p-1 rounded-full bg-purple-600">
              <svg
                width="14"
                height="11"
                viewBox="0 0 16 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 6.5h14M9.5 1 15 6.5 9.5 12"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </span>

          <h1 className="font-poppins text-gray-900 dark:text-base-content font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight">
            Your next career move
            <span className="bg-gradient-to-r from-[#7405de] to-[#a626ec] bg-clip-text text-transparent"> starts here</span>
          </h1>

          <p className="font-roboto mt-5 text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-md">
            Browse thousands of jobs, internships, and freelance opportunities in top companies worldwide.
          </p>
          <div className="flex flex-col sm:flex-row items-center mt-8 gap-4">
            <Link
              to="/alljobs"
              className="btn-brand-primary"
            >
              <span className="font-roboto">Browse Jobs</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.821 11.999h13.43m0 0-6.714-6.715m6.715 6.715-6.715 6.715"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link to={'/resumebuilder'}
              className="btn-brand-secondary"
            >
              Explore Resume Builder
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            For employers:{" "}
            <Link
              to="/employer-create-company"
              className="font-medium text-purple-700 hover:text-purple-800 hover:underline"
            >
              Post a job
            </Link>
          </p>
        </div>

        <div className="w-full max-w-md min-w-0 flex flex-col gap-6">
          <SearchBar />
          {/* Right Images */}
        <div
          aria-label="Photos of professionals"
          className="grid w-full grid-cols-2 gap-4 sm:gap-6"
        >
          {images.map((image, idx) => (
            <img
              key={image.link}
              alt={image.alt}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = fallbackImg;
              }}
              className="h-auto w-full aspect-[3/4] rounded-xl object-cover shadow-lg motion-safe:hover:scale-[1.03] transition duration-300"
              src={image?.link || fallbackImg}
            />
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
