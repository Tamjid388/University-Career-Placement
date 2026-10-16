import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { sendEmail } from "../utils/mailer.js";
import interviewModel from "../models/interview.model.js";
import { buildPageResponse, getPagination, getSort } from "../utils/pagination.js";

const APPLICATION_SORTABLE = { createdAt: 1 };

const attachInterviewsBatched = async (applications) => {
  if (applications.length === 0) return [];
  const jobIds = [...new Set(applications.map((app) => String(app.job?._id || app.job)))];
  const applicantIds = [...new Set(applications.map((app) => String(app.applicant?._id || app.applicant)))];
  const interviews = await interviewModel.find({
    jobId: { $in: jobIds },
    candidateId: { $in: applicantIds },
  });
  const interviewMap = new Map(
    interviews.map((interview) => [`${interview.jobId}-${interview.candidateId}`, interview])
  );
  return applications.map((app) => {
    const appObj = app.toObject();
    const key = `${appObj.job?._id || appObj.job}-${appObj.applicant?._id || appObj.applicant}`;
    return { ...appObj, interview: interviewMap.get(key) || null };
  });
};


export const applyToJob = async (req, res) => {
  try {
    const { jobId, resume, coverLetter } = req.body;

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job",
      });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.id,   // corrected from student to applicant
      resume,
      coverLetter,
    });

    await application.save();

    res.status(201).json({
      success: true,            // fixed typo
      message: "Application submitted successfully.",
    });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


//For Employer
export const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { page, limit, skip } = getPagination(req.query, 15);
    const sort = getSort(req.query, APPLICATION_SORTABLE, { createdAt: -1 });
    const filter = { job: jobId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("applicant", "name email")
        .populate("job", "title image deadline")
        .populate("company", "name logo"),
      Application.countDocuments(filter),
    ]);

    res.status(200).json(buildPageResponse({ items: applications, total, page, limit, key: "applications" }));
    
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


//upsated fetch all application
export const getAllApplicationsForEmployer = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { page, limit, skip } = getPagination(req.query, 15);
    const sort = getSort(req.query, APPLICATION_SORTABLE, { createdAt: -1 });

    // Step 1: Find all jobs posted by this employer
    const jobs = await Job.find({ postedBy: employerId }).select("_id");
    const jobIds = jobs.map((job) => job._id);

    // Step 2: Find applications to these jobs
    const filter = { job: { $in: jobIds } };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.jobId && jobIds.some((id) => String(id) === String(req.query.jobId))) {
      filter.job = req.query.jobId;
    }

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("applicant", "name email")
        .populate({
          path: "job",
          select: "title image deadline",
          populate: {
            path: "company",
            select: "name logo",
          },
        }),
      Application.countDocuments(filter),
    ]);

    // Step 3: Attach interview info (single batched query)
    const applicationsWithInterviews = await attachInterviewsBatched(applications);

    res.status(200).json(buildPageResponse({ items: applicationsWithInterviews, total, page, limit, key: "applications" }));
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


//job seeker
export const getMyApplications = async (req, res) => {
  
  try {
    const { page, limit, skip } = getPagination(req.query, 15);
    const sort = getSort(req.query, APPLICATION_SORTABLE, { createdAt: -1 });
    const filter = { applicant: req.user.id };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("job",)
        .populate("applicant", "name email"),
      Application.countDocuments(filter),
    ]);

       // Attach interview details with a single batched query
    const updatedApplications = await attachInterviewsBatched(applications);
      
    

    res.status(200).json(buildPageResponse({ items: updatedApplications, total, page, limit, key: "applications" }));
  } catch (err) {
    console.error("Error fetching user applications:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Accepted", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

 
    const application = await Application.findById(applicationId).populate('applicant', 'name email');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    try {
      await sendEmail(
        application.applicant.email,
        "Your Application Status Has Been Updated",
        `Hi ${application.applicant.name},\n\nYour application status has been updated to: ${status}.\n\nBest of luck!\nUniversity Job Hub`
      );
    } catch (emailError) {
      console.error("Status saved but notification email failed:", emailError);
    }

    console.log("Email user:", process.env.EMAIL_USER);
    console.log("Email pass exists:", !!process.env.EMAIL_PASS);

    // Optionally return updated application
    const updatedApplication = await Application.findById(applicationId)
      .populate('applicant', 'name email')
      .populate('job');

    res.status(200).json({ success: true, application: updatedApplication });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};





