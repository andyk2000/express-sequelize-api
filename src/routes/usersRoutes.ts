import express from "express";
const userRouter = express.Router();
import { showAvailableShops } from "../controllers/StoreController";
import { signUp, logIn, getUserByID } from "../controllers/UserController";
import { customerCheck, emailVerification } from "../middlewares/customerAuth";
import {
  loginValidation,
  signupValidation,
} from "../middlewares/userValidation";
import check from "../middlewares/authentication";
import { getStoreService } from "../controllers/ServiceController";

userRouter.post("/signup", signupValidation, emailVerification, signUp);
userRouter.post("/login", loginValidation, logIn);
userRouter.get("/", [check, customerCheck], showAvailableShops);
userRouter.get("/:storeurl", check, getStoreService);
userRouter.get("/getUserData/merchant", check, getUserByID);

export { userRouter };
