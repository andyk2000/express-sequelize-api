"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeRouter = void 0;
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const ownerAuthorization_1 = __importDefault(require("../middlewares/ownerAuthorization"));
const dataValidation_1 = require("../middlewares/dataValidation");
const StoreController_1 = require("../controllers/StoreController");
const storeValidation_1 = require("../middlewares/storeValidation");
const storeRouter = express_1.default.Router();
exports.storeRouter = storeRouter;
storeRouter.get("/", [authentication_1.default, ownerAuthorization_1.default], StoreController_1.getStoreByOwner);
storeRouter.post("/", [authentication_1.default, ownerAuthorization_1.default, dataValidation_1.storeDataValidation, storeValidation_1.storeVerification], StoreController_1.createNewStore);
storeRouter.delete("/:id", [authentication_1.default, ownerAuthorization_1.default], StoreController_1.deleteStoreData);
storeRouter.put("/:id", [authentication_1.default, ownerAuthorization_1.default], StoreController_1.updateStoreData);
