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
exports.CartItem = exports.updateCartItem = exports.deleteCartItem = exports.getCartItemID = exports.getCartItems = exports.createCartItem = exports.initializeCartItem = void 0;
const sequelize_1 = require("sequelize");
class CartItem extends sequelize_1.Model {
}
exports.CartItem = CartItem;
const cartItemSchema = {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cart_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "carts",
            key: "id"
        }
    },
    item_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
};
const initializeCartItem = (sequelize) => {
    CartItem.init(cartItemSchema, {
        sequelize,
        modelName: 'cartItem',
        timestamps: false,
    });
};
exports.initializeCartItem = initializeCartItem;
const createCartItem = (cart) => __awaiter(void 0, void 0, void 0, function* () {
    return yield CartItem.create(cart);
});
exports.createCartItem = createCartItem;
const getCartItems = () => __awaiter(void 0, void 0, void 0, function* () {
    const cartsData = yield CartItem.findAll();
    return cartsData;
});
exports.getCartItems = getCartItems;
const getCartItemID = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const cartData = yield CartItem.findOne({
        where: query
    });
    return cartData;
});
exports.getCartItemID = getCartItemID;
const deleteCartItem = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield CartItem.destroy({
        where: query
    });
});
exports.deleteCartItem = deleteCartItem;
const updateCartItem = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield CartItem.update(data, {
        where: query
    });
});
exports.updateCartItem = updateCartItem;
