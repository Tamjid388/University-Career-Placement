import * as statService from "../services/stat.service.js";
import { catchAsync } from "../utils/catchAsync.js";

const UserStatistics = catchAsync(async (req, res) => {
  const stats = await statService.getUserStatistics(req.user.id);
  return res.status(200).json({ message: "User Statistics Fetch SuccessFully", ...stats });
});

const EmployerStatistics = catchAsync(async (req, res) => {
  const stats = await statService.getEmployerStatistics(req.user.id);
  return res.status(200).json({ success: true, ...stats });
});

const AdminStatistics = catchAsync(async (req, res) => {
  const stats = await statService.getAdminStatistics();
  return res.status(200).json({ success: true, ...stats });
});

export const Statistics = { UserStatistics, EmployerStatistics, AdminStatistics };
