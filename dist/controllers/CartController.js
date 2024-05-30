"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addItemToCart = void 0;
const cart_1 = require("../models/cart");
const CartItemController_1 = require("./CartItemController");
const createNewCart = (data, item) => __awaiter(void 0, void 0, void 0, function* () {
    const firstPurchase = data;
    try {
        console.log(firstPurchase);
        const results = yield (0, cart_1.createCart)(firstPurchase);
        console.log(results);
        const newCartData = yield (0, CartItemController_1.createNewCartItem)({ cart_id: results.id, price: data.total_price, item_name: item });
        console.log(results, newCartData);
        return results;
    }
    catch (error) {
        console.error(error);
    }
});
// const getAllCarts = async (request: Request, response: Response) => {
//     try{
//         const data = await getCarts();
//         return response.status(200).json(data);
//     }catch(error){
//         console.log(error);
//         return response.status(500).send("failed to get the data");
//     }
// }
// const getCartByID = async (request: Request, response: Response) => {
//     const id = parseInt(request.params.id);
//     try{
//         const cartData = await getCartID({id: id});
//         return response.status(200).json(cartData);
//     }catch(err){
//         console.log(err);
//         response.status(500).send(`failed to get cart with id${id}`)
//     }
// }
// const deleteCartData = async (request: Request, response: Response) => {
//     const id = parseInt(request.params.id);
//     try {
//         const deletedCart = await deleteCart({id: id});
//         return response.status(200).json(deletedCart);
//     } catch (error) {
//         console.log(error);
//         response.status(200).json(`failed to delete cart with id${id}`)
//     }
// }
const updateCartData = (data, cart) => __awaiter(void 0, void 0, void 0, function* () {
    const total_price = cart.total_price + data.price;
    try {
        const finalCart = yield (0, cart_1.updateCartTotalPrice)(total_price, { id: cart.id });
        const newItem = yield (0, CartItemController_1.createNewCartItem)({ cart_id: cart.id, item_name: data.item, price: data.price });
        console.log(newItem);
        console.log(finalCart);
        return finalCart;
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to update cart");
    }
});
const findCartByCustomer = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, cart_1.findCartOwner)({ customerId: customerId });
});
const addItemToCart = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { item, price, customer } = request.body;
    let total_price = parseInt(price);
    let customerId = parseInt(customer);
    console.log(customerId);
    if (!customerId) {
        return response.status(400).send("Customer ID is required");
    }
    try {
        let cart = yield findCartByCustomer(customerId);
        console.log(cart);
        if (cart === null || cart === undefined) {
            cart = yield createNewCart({ customerId, total_price }, item);
        }
        else {
            cart.total_price = cart.total_price + total_price;
            cart = yield updateCartData({ item, price }, cart);
        }
        return response.status(200).json(cart);
    }
    catch (error) {
        console.error(error);
        return response.status(500).send("Failed to add item to cart");
    }
});
exports.addItemToCart = addItemToCart;
