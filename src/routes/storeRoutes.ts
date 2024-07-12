import express from "express";
import check from "../middlewares/authentication";
import { ownerCheck, storeOwnerCheck } from "../middlewares/ownerAuthorization";
import { storeDataValidation } from "../middlewares/dataValidation";
import {
  getStoreByOwner,
  createNewStore,
  deleteStoreData,
  updateStoreData,
  getStoreCardData,
  getStoreByID,
} from "../controllers/StoreController";
import { storeVerification } from "../middlewares/storeValidation";

const storeRouter = express.Router();
storeRouter.get("/", [check, ownerCheck], getStoreByOwner);
storeRouter.post(
  "/",
  [check, ownerCheck, storeDataValidation, storeVerification],
  createNewStore,
);
storeRouter.delete(
  "/:id",
  [check, ownerCheck, storeOwnerCheck],
  deleteStoreData,
);
storeRouter.put("/:id", [check, ownerCheck, storeOwnerCheck], updateStoreData);
storeRouter.post("/card/data", [check, ownerCheck], getStoreCardData);
storeRouter.post(
  "/storeData/:id",
  [check, ownerCheck, storeOwnerCheck],
  getStoreByID,
);

export { storeRouter };
