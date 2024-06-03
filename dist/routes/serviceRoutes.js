"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRouter = void 0;
const ServiceController_1 = require("../controllers/ServiceController");
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const dataValidation_1 = require("../middlewares/dataValidation");
const ownerAuthorization_1 = __importDefault(require("../middlewares/ownerAuthorization"));
const express_1 = __importDefault(require("express"));
const serviceRouter = express_1.default.Router();
exports.serviceRouter = serviceRouter;
serviceRouter.post("/", [authentication_1.default, ownerAuthorization_1.default, dataValidation_1.serviceDataValidation], ServiceController_1.createNewService);
serviceRouter.get("/", [authentication_1.default, ownerAuthorization_1.default], ServiceController_1.getServiceByID);
serviceRouter.delete("/:id", [authentication_1.default, ownerAuthorization_1.default], ServiceController_1.deleteServiceData);
serviceRouter.put("/:id", [authentication_1.default, ownerAuthorization_1.default], ServiceController_1.updateServiceData);
