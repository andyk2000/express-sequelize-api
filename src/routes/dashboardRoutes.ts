import express from "express";
import {
  findAllStorePayments,
  findLatestTransaction,
  findServiceSold,
} from "../controllers/PaymentController";
import check from "../middlewares/authentication";

const paymentRoutes = express.Router();

paymentRoutes.get("/totalPayment", check, findAllStorePayments);
paymentRoutes.get("/merchant/payments", check, findLatestTransaction);
paymentRoutes.post("/service-sold", check, findServiceSold);

export { paymentRoutes };
