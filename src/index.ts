import express, { Express } from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { initializeUser } from "./models/Users";
import { initializeStore } from "./models/Stores";
import { initializeService } from "./models/Services";
import { initializeCart } from "./models/cart";
import { initializeCartItem } from "./models/CartItem";
import { userRouter } from "./routes/usersRoutes";
import { storeRouter } from "./routes/storeRoutes";
import { serviceRouter } from "./routes/serviceRoutes";
import { cartRouter } from "./routes/cartRoutes";
import { errors } from "celebrate";
import bodyParser from "body-parser";

const router = express.Router();
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const sequelize = new Sequelize(
  "urubuto",
  "admin",
  "YuaB0ITmTrnvouaE0OSe37Dg8ekpQEeZ",
  {
    host: "dpg-cpgm5bm3e1ms73ai91e0-a",
    dialect: "postgres",
  },
);

initializeUser(sequelize);
initializeStore(sequelize);
initializeService(sequelize);
initializeCart(sequelize);
initializeCartItem(sequelize);

router.use("/home", userRouter);

router.use("/store", storeRouter);

router.use("/service", serviceRouter);

router.use("/cart", cartRouter);

app.use(router);
app.use(errors());
app.listen(port, async () => {
  await sequelize.sync({ alter: true });
  console.log("Server Listening on PORT:", port);
});
