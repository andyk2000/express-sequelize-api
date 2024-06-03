import { createNewService, deleteServiceData, getServiceByID, updateServiceData } from "../controllers/ServiceController";
import check from "../middlewares/authentication";
import { serviceDataValidation } from "../middlewares/dataValidation";
import ownerCheck from "../middlewares/ownerAuthorization";
import express from "express";
const serviceRouter = express.Router();

serviceRouter.post("/", [check, ownerCheck, serviceDataValidation] , createNewService);
serviceRouter.get("/", [check, ownerCheck] , getServiceByID);
serviceRouter.delete("/:id", [check, ownerCheck] , deleteServiceData);
serviceRouter.put("/:id", [check, ownerCheck] , updateServiceData);

export {
    serviceRouter
}