import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import { Sequelize } from "sequelize";
import { User, initializeUser } from "./models/Users";
import { Store, initializeStore } from "./models/Stores";
import { Service, initializeService } from "./models/Services";
import { Cart, initializeCart } from "./models/cart";
import { Payment, initializePayment } from "./models/payment";
import { CartItem, initializeCartItem } from "./models/CartItem";
import { userRouter } from "./routes/usersRoutes";
import { storeRouter } from "./routes/storeRoutes";
import { serviceRouter } from "./routes/serviceRoutes";
import { cartRouter } from "./routes/cartRoutes";
import { errors } from "celebrate";
import bodyParser from "body-parser";
import cors from "cors";
import { paymentRoutes } from "./routes/dashboardRoutes";
import fileUpload from "express-fileupload";

const app: Express = express();
const port = process.env.PORT || 3000;

interface Config {
  host: string;
  user: string;
  password: string;
  database: string;
  frontend: string;
}

const config: Config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "mydatabase",
  frontend: process.env.FRONTEND_LINK || "urubuto",
};

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: "*" }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
);

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: "postgres",
  logging: false,
});

initializeUser(sequelize);
initializeStore(sequelize);
initializeService(sequelize);
initializeCart(sequelize);
initializeCartItem(sequelize);
initializePayment(sequelize);

Payment.belongsTo(User);
User.hasMany(Payment);
Payment.belongsTo(Store);
Store.hasMany(Payment);
Store.belongsTo(User);
User.hasMany(Store);
Service.belongsTo(Store);
Store.hasMany(Service);
Cart.belongsTo(User);
User.hasOne(Cart);
CartItem.belongsTo(Cart);
Cart.hasMany(CartItem);
CartItem.belongsTo(Store);
Store.hasMany(CartItem);

// Routes
app.use("/user", userRouter);
app.use("/store", storeRouter);
app.use("/service", serviceRouter);
app.use("/cart", cartRouter);
app.use("/payment", paymentRoutes);

app.use(errors());

// Server initialization
app.listen(port, async () => {
  await sequelize.sync({ alter: true });
  console.log("Server Listening on PORT:", port);
});
