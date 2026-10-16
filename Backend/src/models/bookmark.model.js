import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["job", "company"],
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
  },
  { timestamps: true }
);

bookmarkSchema.pre("validate", function (next) {
  if (this.targetType === "job" && !this.job) {
    return next(new Error("Job reference is required for job bookmarks."));
  }
  if (this.targetType === "company" && !this.company) {
    return next(new Error("Company reference is required for company bookmarks."));
  }
  if (this.targetType === "job") {
    this.company = null;
  }
  if (this.targetType === "company") {
    this.job = null;
  }
  next();
});

bookmarkSchema.index({ user: 1, createdAt: -1 });
bookmarkSchema.index({ user: 1, job: 1 }, { unique: true, sparse: true });
bookmarkSchema.index({ user: 1, company: 1 }, { unique: true, sparse: true });

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
