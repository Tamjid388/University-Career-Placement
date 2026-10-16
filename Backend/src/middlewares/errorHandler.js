import { ZodError } from "zod";

const validationError = (res, errors) =>
  res.status(400).json({ success: false, message: "Validation failed", errors });

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return validationError(
      res,
      err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }))
    );
  }

  // Intentional service errors (HttpError)
  if (err?.statusCode) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // Mongoose bad ObjectId
  if (err?.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid id." });
  }

  // Mongoose schema validation
  if (err?.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Duplicate key
  if (err?.code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate entry." });
  }

  // JWT
  if (err?.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
  if (err?.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token expired." });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: "Server error. Please try again." });
};
