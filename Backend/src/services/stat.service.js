import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { User } from "../models/user.model.js";
import { Attempt } from "../models/skillassesment.model.js";
import { Job } from "../models/job.model.js";

export const getUserStatistics = async (userId) => {
  const user = await User.findById(userId).select("name picture");
  const [totalApplications, pendingApplications, acceptedApplications, rejectedApplications, totalAttempts, completedAttempts, avgResult] =
    await Promise.all([
      Application.countDocuments({ applicant: userId }),
      Application.countDocuments({ applicant: userId, status: "Pending" }),
      Application.countDocuments({ applicant: userId, status: "Accepted" }),
      Application.countDocuments({ applicant: userId, status: "Rejected" }),
      Attempt.countDocuments({ user_id: userId }),
      Attempt.countDocuments({ user_id: userId, status: "completed" }),
      Attempt.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(userId), status: "completed" } },
        { $group: { _id: null, averagePercentage: { $avg: "$percentage" } } },
      ]),
    ]);
  return {
    user,
    totalApplications,
    pendingApplications,
    acceptedApplications,
    rejectedApplications,
    skillStats: { totalAttempts, completedAttempts, averagePercentage: avgResult[0]?.averagePercentage || 0 },
  };
};

export const getEmployerStatistics = async (employerId) => {
  const employerObjectId = new mongoose.Types.ObjectId(employerId);
  const [totalJobcount, totalApplicants, jobsOverTime, appStats] = await Promise.all([
    Job.countDocuments({ postedBy: employerId }),
    Application.aggregate([
      { $lookup: { from: "jobs", localField: "job", foreignField: "_id", as: "jobDetails" } },
      { $unwind: "$jobDetails" },
      { $match: { "jobDetails.postedBy": employerObjectId } },
      { $count: "total" },
    ]),
    Job.aggregate([
      { $match: { postedBy: employerObjectId } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, totalJobs: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Application.aggregate([
      { $lookup: { from: "jobs", localField: "job", foreignField: "_id", as: "jobDetails" } },
      { $unwind: "$jobDetails" },
      { $match: { "jobDetails.postedBy": employerObjectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);
  return { totalJobcount, totalApplicants, jobsOverTime, appStats };
};

export const getAdminStatistics = async () => {
  const [totalUsers, totalJobSeekers, totalEmployers, totalJobs, totalApplications, totalAttempts, completedAttempts, usersByRole, jobsOverTimeRaw, applicationsByStatus, jobsByStatus] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "job-seeker" }),
      User.countDocuments({ role: "employer" }),
      Job.countDocuments(),
      Application.countDocuments(),
      Attempt.countDocuments(),
      Attempt.countDocuments({ status: "completed" }),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Job.aggregate([
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Job.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);
  return {
    totalUsers,
    totalJobSeekers,
    totalEmployers,
    totalJobs,
    totalApplications,
    skillAttempts: { total: totalAttempts, completed: completedAttempts },
    usersByRole,
    jobsOverTime: jobsOverTimeRaw.slice(-8),
    applicationsByStatus,
    jobsByStatus,
  };
};
