import { DataTypes, Sequelize, Model, Optional } from "sequelize";

interface CartItemAttributes {
  id: number;
  cart_id: number;
  item_name: string;
  price: number;
  store_id: number;
}

interface CartItemCreationAttributes
  extends Optional<CartItemAttributes, "id"> {}

class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  public id!: number;
  public cart_id!: number;
  public item_name!: string;
  public price!: number;
  public store_id!: number;
}

const cartItemSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "carts",
      key: "id",
    },
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "stores",
      key: "id",
    },
  },
};

const initializeCartItem = (sequelize: Sequelize) => {
  CartItem.init(cartItemSchema, {
    sequelize,
    modelName: "cartItem",
    timestamps: false,
  });
};

const createCartItem = async (cart: CartItemCreationAttributes) => {
  return await CartItem.create(cart);
};

const getCartItems = async () => {
  const cartsData = await CartItem.findAll();
  return cartsData;
};

const getCartItemID = async (query: NonNullable<unknown>) => {
  const cartData = await CartItem.findOne({
    where: query,
  });
  return cartData;
};

const deleteCartItem = async (query: NonNullable<unknown>) => {
  return await CartItem.destroy({
    where: query,
  });
};

const updateCartItem = async (
  data: NonNullable<unknown>,
  query: NonNullable<unknown>,
) => {
  return await CartItem.update(data, {
    where: query,
  });
};

const getCartCustomer = async (query: NonNullable<unknown>) => {
  return await CartItem.findAll({
    where: query,
  });
};

export {
  initializeCartItem,
  createCartItem,
  getCartItems,
  getCartItemID,
  deleteCartItem,
  updateCartItem,
  getCartCustomer,
};
