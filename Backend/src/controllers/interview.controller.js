import { Application } from "../models/application.model.js";
import interviewModel from "../models/interview.model.js";
import { buildPageResponse, getPagination, getSort } from "../utils/pagination.js";


export const scheduleInterview = async (req, res) => {
  try {
    const { jobId, candidateId, scheduledAt, mode, locationOrLink, notes } = req.body;
    const employerId = req.user.id;

    const interview = await interviewModel.create({
      jobId,
      candidateId,
      employerId,
      scheduledAt,
      mode,
      locationOrLink,
      notes,
    });


    // 2. Update the application status to "Scheduled"
    await Application.findOneAndUpdate(
      { job: jobId, applicant: candidateId },
      { status: "Scheduled" }
    );




    res.status(201).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Interview scheduling failed', error: error.message });
  }
};

export const getEmployerInterviews = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { page, limit, skip } = getPagination(req.query, 15);
    const sort = getSort(req.query, { scheduledAt: 1, createdAt: 1 }, { scheduledAt: -1 });
    const filter = { employerId };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const [interviews, total] = await Promise.all([
      interviewModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('candidateId', 'name email')
        .populate('jobId', 'title'),
      interviewModel.countDocuments(filter),
    ]);

    res.status(200).json(buildPageResponse({ items: interviews, total, page, limit, key: "interviews" }));
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch interviews', error: error.message });
  }
}

export const updateInterviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const interview = await interviewModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });

    res.status(200).json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Status update failed', error: error.message });
  }
};
