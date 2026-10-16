// models/Interview.js
import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  mode: { type: String, enum: ['Online', 'Offline'], required: true },
  locationOrLink: { type: String }, // Zoom/Meet link or address
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  notes: { type: String },
}, { timestamps: true });

interviewSchema.index({ employerId: 1, scheduledAt: -1 });
interviewSchema.index({ jobId: 1, candidateId: 1 });

export default mongoose.model('Interview', interviewSchema);
