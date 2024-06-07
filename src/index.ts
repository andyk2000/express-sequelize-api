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
import cors from "cors";

const router = express.Router();
dotenv.config();

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

app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", config.frontend],
  }),
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: "postgres",
});

initializeUser(sequelize);
initializeStore(sequelize);
initializeService(sequelize);
initializeCart(sequelize);
initializeCartItem(sequelize);

router.use("/user", userRouter);

router.use("/store", storeRouter);

router.use("/service", serviceRouter);

router.use("/cart", cartRouter);

app.use(router);
app.use(errors());
app.listen(port, async () => {
  await sequelize.sync({ alter: true });
  console.log("Server Listening on PORT:", port);
});
