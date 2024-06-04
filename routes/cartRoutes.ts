import { addItemsToCart, getCartByCustomer } from "../controllers/CartController";
import { getStoreService } from "../controllers/ServiceController";
import express from "express";
import check from "../middlewares/authentication";
const cartRouter = express.Router();

cartRouter.get("/urubuto-store/:store_name", check, getStoreService);
cartRouter.post("/addItem", check, addItemsToCart);
cartRouter.get("/all-items", check, getCartByCustomer);
export {
    cartRouter
}