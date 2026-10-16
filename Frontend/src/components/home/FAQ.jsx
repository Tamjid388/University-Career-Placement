import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { Link } from "react-router";
import { Heading } from "../shared/Heading";

const platformFaqs = [
  {
    question: "How do I apply for a job?",
    answer:
      "Browse listings on the Jobs page, open a role, and submit your application with your profile and resume. You can track every application from your jobseeker dashboard.",
  },
  {
    question: "How do I create an account?",
    answer:
      "Choose Sign In or Create Account in the navbar. Jobseekers register with email, employers create a company account first and then get access to posting jobs.",
  },
  {
    question: "How does the Resume Builder work?",
    answer:
      "Pick a template, fill in your education, experience, and skills step by step, then preview and download your resume. Your resumes stay saved under Manage Resume.",
  },
  {
    question: "What is the Portfolio Builder?",
    answer:
      "It turns your projects, skills, and experience into a public portfolio page with its own link that you can share with employers.",
  },
  {
    question: "How do Skill Assessments help me?",
    answer:
      "Assessments validate your skills with scored quizzes you can reference in applications. Start one from the Skill Assessment page when logged in.",
  },
  {
    question: "I'm an employer. How do I post a job?",
    answer:
      "Create an employer account, add your company profile, then use Post a Job from your dashboard. Listings go live after approval.",
  },
  {
    question: "How do interviews get scheduled?",
    answer:
      "Employers shortlist applications and schedule interviews from their dashboard. Jobseekers see invitations and details under Applied Jobs.",
  },
  {
    question: "Is JobPortal free for students?",
    answer:
      "Yes. Job search, applications, resume and portfolio builders, and skill assessments are free for students and jobseekers.",
  },
];

const FaqSection = ({
  showall = false,
  items,
  title = "Frequently Asked Questions",
  subtitle = "How JobPortal works for students and employers",
}) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = Array.isArray(items) && items.length > 0 ? items : platformFaqs;
  const visibleFaqs = showall ? faqs : faqs.slice(0, 5);

  return (
    <section className="home-section bg-base-100">
      <div className="home-container">
        <Heading title={title} subtitle={subtitle} />


        <div className="space-y-3">
          {visibleFaqs.map((item, index) => (
            <div
              key={index}
              className="border border-base-300 rounded-xl overflow-hidden shadow-sm bg-base-100"
            >
              <button
                onClick={() => toggle(index)}
                aria-expanded={openIndex === index}
                className="w-full flex justify-between items-center gap-4 px-6 py-4 text-left text-base sm:text-lg font-medium hover:bg-base-200 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                <span>{item.question}</span>
                <span className="text-gray-400 text-xl shrink-0">
                  {openIndex === index ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 card-body-text">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {!showall && (
          <div className="text-center mt-8">
            <Link to="/interview-questions" className="btn-brand-gradient">
              Read More
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqSection;
