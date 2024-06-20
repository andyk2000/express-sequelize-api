import express from "express";
import {
  findAllStorePayments,
  findLatestTransaction,
  findServiceFilterByDate,
  findServiceSold,
  searchPayments,
  statRetrieval,
} from "../controllers/PaymentController";
import check from "../middlewares/authentication";

const paymentRoutes = express.Router();

paymentRoutes.get("/totalPayment", check, findAllStorePayments);
paymentRoutes.get("/merchant/payments", check, findLatestTransaction);
paymentRoutes.post("/service-sold", check, findServiceSold);
paymentRoutes.post("/stats", check, statRetrieval);
paymentRoutes.post("/search", check, searchPayments);
paymentRoutes.post("/filter/date", check, findServiceFilterByDate);
export { paymentRoutes };
