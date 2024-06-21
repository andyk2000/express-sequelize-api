import express from "express";
import {
  filterDate,
  findAllStorePayments,
  // findLatestTransaction,
  findServiceSold,
  getAllTransactions,
  // getAllpayment,
  searchPayments,
  statRetrieval,
} from "../controllers/PaymentController";
import check from "../middlewares/authentication";

const paymentRoutes = express.Router();

paymentRoutes.get("/totalPayment", check, findAllStorePayments);
paymentRoutes.get("/merchant/payments", check, getAllTransactions);
paymentRoutes.post("/service-sold", check, findServiceSold);
paymentRoutes.post("/stats", check, statRetrieval);
paymentRoutes.post("/search", check, searchPayments);
paymentRoutes.post("/filter/date", check, filterDate);
export { paymentRoutes };
