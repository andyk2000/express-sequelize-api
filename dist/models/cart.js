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
exports.Cart = exports.findCartOwner = exports.updateCart = exports.deleteCart = exports.getCartID = exports.getCarts = exports.createCart = exports.initializeCart = void 0;
const sequelize_1 = require("sequelize");
// Define the User model class
class Cart extends sequelize_1.Model {
}
exports.Cart = Cart;
// Define the user model schema
const cartSchema = {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    items: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
    },
    total_price: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
};
const initializeCart = (sequelize) => {
    Cart.init(cartSchema, {
        sequelize,
        modelName: 'cart',
        timestamps: false,
    });
};
exports.initializeCart = initializeCart;
const createCart = (cart) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Cart.create(cart);
});
exports.createCart = createCart;
const getCarts = () => __awaiter(void 0, void 0, void 0, function* () {
    const cartsData = yield Cart.findAll();
    return cartsData;
});
exports.getCarts = getCarts;
const getCartID = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const cartData = yield Cart.findOne({
        where: query
    });
    return cartData;
});
exports.getCartID = getCartID;
const deleteCart = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Cart.destroy({
        where: query
    });
});
exports.deleteCart = deleteCart;
const updateCart = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Cart.update(data, {
        where: query
    });
});
exports.updateCart = updateCart;
const findCartOwner = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Cart.findOne({
        where: query
    });
});
exports.findCartOwner = findCartOwner;
