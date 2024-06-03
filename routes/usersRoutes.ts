import express from "express";
const userRouter = express.Router();
import { showAvailableShops } from "../controllers/StoreController";
import { signUp, logIn } from "../controllers/UserController";
import { customerCheck, emailVerification } from "../middlewares/customerAuth";
import { loginValidation } from "../middlewares/userValidation";

userRouter.post("/signup", emailVerification, signUp);
userRouter.post("/login", loginValidation , logIn);
userRouter.get("/", customerCheck, showAvailableShops);

export {
    userRouter,
}