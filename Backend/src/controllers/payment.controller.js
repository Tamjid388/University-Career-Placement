import * as paymentService from "../services/payment.service.js";
import { catchAsync } from "../utils/catchAsync.js";

const createPayment = catchAsync(async (req, res) => {
  try {
    const { gatewayUrl, data } = await paymentService.createPayment(req.body);
    return res.status(201).json({ message: "Payment created successfully", gatewayUrl, data });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

const successPayment = catchAsync(async (req, res) => {
  const FRONTEND_URL = process.env.FRONTEND_URL;
  try {
    const { valid } = await paymentService.confirmSuccessPayment(req.body);
    if (valid) {
      return res.redirect(`${FRONTEND_URL}/payment-success`);
    }
    return res.send({ message: "Invalid Payment" });
  } catch (error) {
    if (error?.statusCode === 404) {
      return res.status(404).json({ message: "Payment record not found" });
    }
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

const failPayment = (req, res) => {
  const FRONTEND_URL = process.env.FRONTEND_URL;
  return res.redirect(`${FRONTEND_URL}/payment-fail`);
};

const cancelPayment = (req, res) => {
  const FRONTEND_URL = process.env.FRONTEND_URL;
  return res.redirect(`${FRONTEND_URL}/payment-cancel`);
};

export const paymentController = { createPayment, successPayment, failPayment, cancelPayment };
