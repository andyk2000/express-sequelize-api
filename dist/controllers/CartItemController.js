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
exports.getCartItemBycart = exports.createNewCartItem = void 0;
const CartItem_1 = require("../models/CartItem");
const CartItem_2 = require("../models/CartItem");
const createNewCartItem = (newCartItem) => __awaiter(void 0, void 0, void 0, function* () {
    const cart_id = newCartItem.cart_id;
    const item_name = newCartItem.item_name;
    const price = newCartItem.price;
    try {
        const data = yield (0, CartItem_2.createCartItem)({ cart_id, item_name, price });
        return data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
});
exports.createNewCartItem = createNewCartItem;
const getCartItemBycart = (Cart) => __awaiter(void 0, void 0, void 0, function* () {
    const cart_id = Cart;
    try {
        const results = yield (0, CartItem_1.getCartCustomer)({ cart_id: cart_id });
        return results;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
exports.getCartItemBycart = getCartItemBycart;
