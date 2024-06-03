import { addItemsToCart } from "../controllers/CartController";
import { getStoreService } from "../controllers/ServiceController";
import express from "express";
const cartRouter = express.Router();

cartRouter.get("/urubuto-store/:store_name", getStoreService);
cartRouter.post("/addItem", addItemsToCart);

export {
    cartRouter
}