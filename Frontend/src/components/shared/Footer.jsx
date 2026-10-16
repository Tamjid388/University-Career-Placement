import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaLinkedin,
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaGraduationCap,
} from "react-icons/fa";
import { Link } from "react-router";

const studentLinks = [
  { label: "Job Search", to: "/alljobs" },
  { label: "Skill Assessment", to: "/skill-assessment" },
  { label: "Resume Builder", to: "/resumebuilder" },
  { label: "Portfolio Builder", to: "/portfolio-builder" },
  { label: "Interview Questions", to: "/interview-questions" },
];

const employerLinks = [
  { label: "Post a Job", to: "/create-job" },
  { label: "Create Account", to: "/employer-create-company" },
  { label: "Sign In", to: "/employer-signIn" },
  { label: "Companies", to: "/allcompanies" },
];

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com", Icon: FaLinkedin },
  { label: "Twitter", href: "https://x.com", Icon: FaTwitter },
  { label: "Facebook", href: "https://www.facebook.com", Icon: FaFacebookF },
  { label: "Instagram", href: "https://www.instagram.com", Icon: FaInstagram },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Left Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 flex items-center justify-center bg-purple-700 text-white rounded-md">
              <FaGraduationCap />
            </div>
            <h2 className="font-bold text-white text-lg">JobPortal</h2>
          </div>
          <p className="text-sm mb-4">
            Empowering students and connecting them with top employers. Your gateway to a successful career starts here.
          </p>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-purple-400 shrink-0" /> contact-smartjob-portal@gmail.com
            </li>
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-purple-400 shrink-0" /> +8801864943775
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-purple-400 shrink-0" />Daffodil Smart City
            </li>
          </ul>
        </div>

        {/* Company */}
        <nav aria-label="Company">
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/alljobs" className="hover:text-white transition">
                Jobs
              </Link>
            </li>
            <li>
              <Link to="/allcompanies" className="hover:text-white transition">
                Companies
              </Link>
            </li>
            <li>
              <Link to="/termsAndcondion" className="hover:text-white transition">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/interview-questions" className="hover:text-white transition">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>

        {/* For Students */}
        <nav aria-label="For students">
          <h4 className="text-white font-semibold mb-4">For Students</h4>
          <ul className="space-y-2 text-sm">
            {studentLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="hover:text-white transition">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* For Employers */}
        <nav aria-label="For employers">
          <h4 className="text-white font-semibold mb-4">For Employers</h4>
          <ul className="space-y-2 text-sm">
            {employerLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="hover:text-white transition">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm">&copy; {year} JobPortal. All rights reserved.</p>
        <div className="flex gap-3">
          {socials.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`JobPortal on ${label}`}
              className="w-8 h-8 flex items-center justify-center bg-gray-800 hover:bg-purple-700 rounded-md text-white transition"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
