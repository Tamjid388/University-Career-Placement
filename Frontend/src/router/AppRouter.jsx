import { createBrowserRouter } from "react-router";
import { SignIn } from "../features/authentication/SignIn";
import { SignUp } from "../features/authentication/SignUp";
import { DashBoardLayout } from "../layouts/DashBoardLayout";
import { MainLayouts } from "../layouts/MainLayouts";
import { BlogDetails } from "../pages/BlogDetails";
import { Home } from "../pages/Home";
import JobDetails from "../pages/JobDetails.jsx";

import { AdminDashboardMenu } from "../components/drawer/sidebarmenus/adminsidebarmenus/admindashboard/AdminDashboardMenu.jsx";
import { ManageCompany } from "../components/drawer/sidebarmenus/adminsidebarmenus/managecompany/ManageCompany.jsx";

import AllCompany from "../pages/company/AllCompany.jsx";
import JobsShowAll from "../pages/jobs/JobsShowAll.jsx";
import JobSearchResults from "../pages/jobs/JobSearchResults.jsx";

import { EmployerDashboardMenu } from "../components/drawer/sidebarmenus/employersidebarmenus/employerdashboard/EmployerDashboardMenu.jsx";
import { PostedJobs } from "../components/drawer/sidebarmenus/employersidebarmenus/postedjobs/PostedJobs.jsx";

import { ManageUsers } from "../components/drawer/sidebarmenus/adminsidebarmenus/manageusers/ManageUsers.jsx";
import { JobseekerProfile } from "../components/drawer/sidebarmenus/jobseekersidebarmenus/profile/JobseekerProfile.jsx";

import { JobSeekerDashboardMenu } from "../components/drawer/sidebarmenus/jobseekersidebarmenus/jobseekerdashboard/JobSeekerDashboardMenu.jsx";

import EmployerApplication from "../components/drawer/sidebarmenus/employersidebarmenus/employercompanys/employerapplications/EmployerApplication.jsx";
import EmployerCompany from "../components/drawer/sidebarmenus/employersidebarmenus/employercompanys/EmployerCompany.jsx";
import EmployerShowAllApplication from "../components/drawer/sidebarmenus/employersidebarmenus/employerinterview/EmployerShowAllApplication.jsx";
import JobSeekerAppliedJobs from "../components/drawer/sidebarmenus/jobseekersidebarmenus/jobseekerappliedjobs/JobSeekerAppliedJobs.jsx";
import EmployerSignUP from "../features/authentication/EmployerSignUP.jsx";
import PortfolioLayout from "../layouts/PortfolioLayout.jsx";
import AllFaqs from "../pages/AllFaqs.jsx";
import CompanyDetails from "../pages/company/CompanyDetails.jsx";

import ViewMyPortfolio from "../pages/portfolio/ViewMyPortfolio.jsx";

import { CreateJob } from "./../pages/empoloyer/CreateJob";
import { NotFOund } from "../pages/notfound/NotFOund.jsx";
import EmployerSignIn from "../features/authentication/EmployerSignIn.jsx";
import { ResumeBuilder } from "../pages/resumebuilder/ResumeBuilder.jsx";
import { SelectOption } from "../pages/resumebuilder/resumeui/SelectOption.jsx";
import BuildYourResume from "../pages/resumebuilder/resumeui/BuildYourResume.jsx";
import { ResumeProvider } from "../context/ResumeProvider.jsx";
import { Demo } from "../pages/demo/demo.jsx";
import PaymentSuccess from "../components/payments/feauturedjobpayment/PaymentSuccess.jsx";
import PaymentFailed from "../components/payments/feauturedjobpayment/PaymentFailed.jsx";
import Paymentcancel from "../components/payments/feauturedjobpayment/Paymentcancel.jsx";

import FeaturedPayment from "../pages/payments/featuredpayment/FeaturedPayment.jsx";
import { Privateroute } from "../components/privateroute/Privateroute.jsx";
import { ManageJobs } from "../components/drawer/sidebarmenus/adminsidebarmenus/managejob/ManageJobs.admin.jsx";
import { SkillAssesmentHome } from "../pages/skillassesment/SkillAssesmentHome.jsx";
import { Assesments } from "../pages/skillassesment/assesments/Assesments.jsx";
import { AllQuestions } from "../pages/skillassesment/AllQuestions.jsx";
import { ManageSkillAssessment } from "../components/drawer/sidebarmenus/adminsidebarmenus/manageskillassessment/ManageSkillAssessment.jsx";
import BuildPortfolio from "../pages/portfolio/BuildPortfolio.jsx";
import { PortfolionBuilderHome } from "../pages/portfolio/PortfolionBuilderHome.jsx";
import { SelectPortfolioTemp } from "../pages/portfolio/SelectPortfolioTemp.jsx";
import { SelectedTemplate } from "../pages/portfolio/categories/SelectedTemplate.jsx";
import { ManagePortfolio } from "../components/drawer/sidebarmenus/jobseekersidebarmenus/manageportfolio/ManagePortfolio.jsx";
import { PublicPortfolio } from "../pages/portfolio/categories/PublicPortfolio.jsx";
import { TermsAndCondition } from "../pages/termsandcondition/TermsAndCondition.jsx";
import { ManageResume } from "../components/drawer/sidebarmenus/jobseekersidebarmenus/manageresume/ManageResume.jsx";
import ArticleDetails from "../components/home/ArticleDetails.jsx";
import { ForgotPassword } from "../features/authentication/ForgotPassword.jsx";
import { ResetPassword } from "../features/authentication/ResetPassword.jsx";
import { ChangePassword } from "../features/authentication/ChangePassword.jsx";


export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts />,
    errorElement: <NotFOund />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/demo",
        element: <Demo />,
      },
      {
        path: "/SignUp",
        element: <SignUp />,
      },
      {
        path: "/SignIn",
        element: <SignIn />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/blog/blogdetails/:id",
        element: <BlogDetails />,
      },
      {
        path: "/job/details/:id",
        element: <JobDetails />,
      },
      {

         path: "/article/:id",
  element: <ArticleDetails />
      },


      {
        path: "/alljobs",
        element: <JobsShowAll />,
      },
      {
        path: "/job/search-results",
        element: <JobSearchResults />,
      },

      {
        path: "/allcompanies",
        element: <AllCompany />,
      },
      {
        path: "/companydetails/:id",
        element: <CompanyDetails />,
      },
      {
        path: "/interview-questions",
        element: <AllFaqs />,
      },
      {
        path: "/employer-create-company",
        element: <EmployerSignUP />,
      },
      {
        path: "/employer-signIn",
        element: <EmployerSignIn />,
      },
      {
        path: "/create-job",
        element: <CreateJob />,
      },
      {
        path: "/company",
        element: <CompanyDetails />,
      },
      // --> Portfolio Builder
      {
        path: "/portfolio-builder",
        element: <PortfolionBuilderHome />,
      },
      {
        path: "/portfolio-builder/create",
        element: (
          <Privateroute>
            <BuildPortfolio />
          </Privateroute>
        ),
      },

      {
        path: "/myportfolio",
        element: <ViewMyPortfolio />,
      },
      {
        path: "/select-portfolio-template",
        element: <SelectPortfolioTemp />,
      },
      {
        path: "/selected-template/:id",
        element: <SelectedTemplate />,
      },

      //payment,

      {
        path: "/featured-payment",
        element: <FeaturedPayment />,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "/payment-fail",
        element: <PaymentFailed />,
      },
      {
        path: "/payment-cancel",
        element: <Paymentcancel />,
      },
      //Skill Assesmnet
      {
        path: "/skill-assessment",
        element: <SkillAssesmentHome />,
      },
      {
        path: `/skills/:id`,
        element: (
          <Privateroute>
            <Assesments />
          </Privateroute>
        ),
      },
      {
        path: "/quiz-started/questions",
        element: <AllQuestions />,
      },

      //..........
      //Resume Builder
      {
        path: "/resumebuilder",
        element: <ResumeBuilder />,
      },
      { path: "/resumebuilder/selectoption", element: <SelectOption /> },
      {
        path: "/resumebuilder/build-your-resume/:id",
        element: (
          <Privateroute>
            <ResumeProvider>
              <BuildYourResume />
            </ResumeProvider>
          </Privateroute>
        ),
      },
      // For footer
      {
        path: "/termsAndcondion",
        element: <TermsAndCondition />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashBoardLayout></DashBoardLayout>,
    children: [
      {
        path: "jobseekerDashboard",
        element: (
          <Privateroute>
            <JobSeekerDashboardMenu />
          </Privateroute>
        ),
      },
      {
        path: "jobseekerProfile",
        element: (
          <Privateroute>
            <JobseekerProfile />
          </Privateroute>
        ),
      },
      {
        path: "jobseekerAppliedJob",
        element: (
          <Privateroute>
            <JobSeekerAppliedJobs />
          </Privateroute>
        ),
      },

      {
        path: "jobseekerMyPortfolio",
        element: (
          <Privateroute>
            <ManagePortfolio />
          </Privateroute>
        ),
      },
      {
        path: "jobseekerManageResume",
        element: (
          <Privateroute>
            <ManageResume />
          </Privateroute>
        ),
      },

      // For Employer
      {
        path: "employerDashboard",
        element: (
          <Privateroute>
            <EmployerDashboardMenu />
          </Privateroute>
        ),
      },

      {
        path: "employer/create-job",
        element: (
          <Privateroute>
            <CreateJob />
          </Privateroute>
        ),
      },
      {
        path: "employer/postedJobs",
        element: (
          <Privateroute>
            <PostedJobs />
          </Privateroute>
        ),
      },
      {
        path: "employer/managecompany",
        element: (
          <Privateroute>
            {" "}
            <EmployerCompany />
          </Privateroute>
        ),
      },
      {
        path: "employer/applications",
        element: (
          <Privateroute>
            <EmployerApplication />{" "}
          </Privateroute>
        ),
      },
      {
        path: "employer/alljobs",
        element: (
          <Privateroute>
            <JobsShowAll />
          </Privateroute>
        ),
      },
      {
        path: "employer/interview",
        element: (
          <Privateroute>
            <EmployerShowAllApplication />
          </Privateroute>
        ),
      },

      //for admin
      {
        path: "adminDashboard",
        element: (
          <Privateroute>
            <AdminDashboardMenu />
          </Privateroute>
        ),
      },
      {
        path: "manageCompany",
        element: (
          <Privateroute>
            <ManageCompany />
          </Privateroute>
        ),
      },
      {
        path: "manageUsers",
        element: (
          <Privateroute>
            <ManageUsers />
          </Privateroute>
        ),
      },
      {
        path: "manageJobs",
        element: (
          <Privateroute>
            <ManageJobs />
          </Privateroute>
        ),
      },
      {
        path: "manage-skill-assessment",
        element: (
          <Privateroute>
            <ManageSkillAssessment />
          </Privateroute>
        ),
      },
      {
        path: "change-password",
        element: (
          <Privateroute>
            <div className="p-4 md:p-6 flex justify-center">
              <ChangePassword />
            </div>
          </Privateroute>
        ),
      },
    ],
  },

  {
    path: "/portfolio/:slug",
    element: <PublicPortfolio />,
  },
]);
