import express from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { validate } from '../middlewares/validate.js';
import { createPaymentSchema } from '../validations/payment.schema.js';

const router = express.Router()

router.post("/create-ssl-payment", validate(createPaymentSchema), paymentController.createPayment)
router.post("/success-payment", paymentController.successPayment)
router.post("/payment-fail", paymentController.failPayment)
router.post("/payment-cancel", paymentController.cancelPayment)

export default router
