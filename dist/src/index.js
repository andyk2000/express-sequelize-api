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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const Users_1 = require("../models/Users");
const Stores_1 = require("../models/Stores");
const Services_1 = require("../models/Services");
const cart_1 = require("../models/cart");
const CartItem_1 = require("../models/CartItem");
const usersRoutes_1 = require("../routes/usersRoutes");
const storeRoutes_1 = require("../routes/storeRoutes");
const serviceRoutes_1 = require("../routes/serviceRoutes");
const cartRoutes_1 = require("../routes/cartRoutes");
const celebrate_1 = require("celebrate");
const router = express_1.default.Router();
const bodyParser = require("body-parser");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
const sequelize = new sequelize_1.Sequelize('urubuto', 'postgres', 'Ny@bibuye30', {
    host: 'localhost',
    dialect: 'postgres'
});
(0, Users_1.initializeUser)(sequelize);
(0, Stores_1.initializeStore)(sequelize);
(0, Services_1.initializeService)(sequelize);
(0, cart_1.initializeCart)(sequelize);
(0, CartItem_1.initializeCartItem)(sequelize);
router.use('/home', usersRoutes_1.userRouter);
router.use('/store', storeRoutes_1.storeRouter);
router.use('/service', serviceRoutes_1.serviceRouter);
router.use('/cart', cartRoutes_1.cartRouter);
app.use(router);
app.use((0, celebrate_1.errors)());
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.sync({ alter: true });
    console.log("Server Listening on PORT:", port);
}));
