"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
const StoreController_1 = require("../controllers/StoreController");
const UserController_1 = require("../controllers/UserController");
const customerAuth_1 = require("../middlewares/customerAuth");
const userValidation_1 = require("../middlewares/userValidation");
userRouter.post("/signup", customerAuth_1.emailVerification, UserController_1.signUp);
userRouter.post("/login", userValidation_1.loginValidation, UserController_1.logIn);
userRouter.get("/", customerAuth_1.customerCheck, StoreController_1.showAvailableShops);
