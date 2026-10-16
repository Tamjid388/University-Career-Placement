import express from "express";
import { createCompany, deleteCompany, getAllCompanies, getCompanyById, getMyCompany, updateCompany } from "../controllers/company.controller.js";
import { verifyToken } from "../middlewares/verifytoken.js";
import { requireEmployer } from "../middlewares/requireemployer.js";
import { validate } from "../middlewares/validate.js";
import { createCompanySchema, updateCompanySchema } from "../validations/company.schema.js";

const router = express.Router();

router.post("/createcompany", verifyToken, requireEmployer, validate(createCompanySchema), createCompany);
router.get("/", getAllCompanies);
router.get("/my-company", verifyToken, getMyCompany);
router.get("/:id", getCompanyById);
router.put("/:id", verifyToken, validate(updateCompanySchema), updateCompany);
router.delete("/:id", verifyToken, requireEmployer, deleteCompany);

export default router;
