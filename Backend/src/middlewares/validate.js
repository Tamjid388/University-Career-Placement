import { ZodError } from "zod";

export const validate = (schema, source = "body") => (req, res, next) => {
  try {
    const data = req[source] ?? {};
    req[source] = schema.parse(data);
    return next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    return next(err);
  }
};
