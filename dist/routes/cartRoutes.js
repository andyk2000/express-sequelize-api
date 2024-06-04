"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartRouter = void 0;
const CartController_1 = require("../controllers/CartController");
const ServiceController_1 = require("../controllers/ServiceController");
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const cartRouter = express_1.default.Router();
exports.cartRouter = cartRouter;
cartRouter.get("/urubuto-store/:store_name", authentication_1.default, ServiceController_1.getStoreService);
cartRouter.post("/addItem", authentication_1.default, CartController_1.addItemsToCart);
cartRouter.get("/all-items", authentication_1.default, CartController_1.getCartByCustomer);
