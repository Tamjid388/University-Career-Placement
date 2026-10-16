import mongoose from "mongoose";
import axios from "axios";
import { paymentModel } from "../models/payment.model.js";
import { HttpError } from "../utils/httpError.js";

export const createPayment = async ({ userId, email, amount }) => {
  const trx_id = new mongoose.Types.ObjectId();
  const payment = new paymentModel({ userId, email, amount, trx_id, status: "pending" });
  await payment.save();
  const BACKEND_URL = process.env.BACKEND_URL;
  const initiate = {
    store_id: process.env.STORE_ID,
    store_passwd: process.env.STORE_PASSWORD,
    tran_id: trx_id.toString(),
    success_url: `${BACKEND_URL}/api/v1/payment/success-payment`,
    fail_url: `${BACKEND_URL}/api/v1/payment/payment-fail`,
    cancel_url: `${BACKEND_URL}/api/v1/payment/payment-cancel`,
    total_amount: amount,
    shipping_method: "NO",
    product_name: "featured",
    product_category: "digital",
    product_profile: "general",
    cus_name: "Tamjid Ahmed",
    cus_email: email,
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: "0179102211",
  };
  const initResponse = await axios({
    url: "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    method: "POST",
    data: initiate,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return { payment, gatewayUrl: initResponse.data.GatewayPageURL, data: initResponse.data };
};

export const confirmSuccessPayment = async (paymentSuccess) => {
  const store_id = process.env.STORE_ID;
  const store_passwd = process.env.STORE_PASSWORD;
  const isValidatePayment = await axios.get(
    `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${paymentSuccess.val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`
  );
  const validationData = isValidatePayment.data;
  const payment = await paymentModel.findOne({ trx_id: validationData.tran_id });
  if (!payment) throw new HttpError(404, "Payment record not found");
  if (validationData.status === "VALID") {
    payment.status = "success";
    await payment.save();
    return { valid: true };
  }
  return { valid: false };
};
