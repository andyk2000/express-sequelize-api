import express from "express";
import check from "../middlewares/authentication";
import ownerCheck from "../middlewares/ownerAuthorization";
import { storeDataValidation } from "../middlewares/dataValidation";
import {
  getStoreByOwner,
  createNewStore,
  deleteStoreData,
  updateStoreData,
  getStoreCardData,
} from "../controllers/StoreController";
import { storeVerification } from "../middlewares/storeValidation";

const storeRouter = express.Router();
storeRouter.get("/", [check, ownerCheck], getStoreByOwner);
storeRouter.post(
  "/",
  [check, ownerCheck, storeDataValidation, storeVerification],
  createNewStore,
);
storeRouter.delete("/:id", [check, ownerCheck], deleteStoreData);
storeRouter.put("/:id", [check, ownerCheck], updateStoreData);
storeRouter.post("/card/data", [check, ownerCheck], getStoreCardData);

export { storeRouter };
