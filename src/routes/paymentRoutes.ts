import express from "express";
import { findAllStorePayments } from "../controllers/PaymentController";
import check from "../middlewares/authentication";

const paymentRoutes = express.Router();

paymentRoutes.get("/totalPayment", check, findAllStorePayments);

export { paymentRoutes };
