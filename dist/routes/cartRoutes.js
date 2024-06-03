"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const CartController_1 = require("../controllers/CartController");
const ServiceController_1 = require("../controllers/ServiceController");
const express_1 = __importDefault(require("express"));
const cartRouter = express_1.default.Router();
exports.cartRouter = cartRouter;
cartRouter.get("/urubuto-store/:store_name", ServiceController_1.getStoreService);
cartRouter.post("/addItem", CartController_1.addItemToCart);
