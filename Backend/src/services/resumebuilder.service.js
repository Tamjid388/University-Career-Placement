import mongoose from "mongoose";
import { resumeModel } from "../models/resumebuilder.model.js";
import { HttpError } from "../utils/httpError.js";

export const createOrUpdateResume = async (data) => {
  if (!data.userId) throw new HttpError(400, "User ID is required");
  const userObjectId = new mongoose.Types.ObjectId(data.userId);
  const existing = await resumeModel.findOne({ userId: userObjectId });
  if (existing) {
    return {
      resume: await resumeModel.findOneAndUpdate({ userId: userObjectId }, { $set: data }, { new: true }),
      created: false,
    };
  }
  const resume = new resumeModel({ ...data, userId: userObjectId });
  await resume.save();
  return { resume, created: true };
};

export const getUserResume = async (userId) => {
  if (!userId) throw new HttpError(400, "User ID is required");
  return resumeModel.findOne({ userId }).populate("userId", "name email");
};

export const deleteResume = async (id) => {
  if (!id) throw new HttpError(400, "Resume ID is required");
  const resume = await resumeModel.findByIdAndDelete(id);
  if (!resume) throw new HttpError(404, "Resume not found");
  return true;
};
