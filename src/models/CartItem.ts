import { DataTypes, Sequelize, Model, Optional } from "sequelize";

interface CartItemAttributes {
  id: number;
  cartId: number;
  item_name: string;
  price: number;
  storeId: number;
}

interface CartItemCreationAttributes
  extends Optional<CartItemAttributes, "id"> {}

class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  public id!: number;
  public cartId!: number;
  public item_name!: string;
  public price!: number;
  public storeId!: number;
}

const cartItemSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cartId: {
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
  storeId: {
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

const getCartItemID = async (id: number) => {
  const cartData = await CartItem.findOne({
    where: {
      id: id,
    },
  });
  return cartData;
};

const deleteCartItem = async (id: number) => {
  return await CartItem.destroy({
    where: {
      id: id,
    },
  });
};

const updateCartItem = async (data: CartItemCreationAttributes, id: number) => {
  return await CartItem.update(data, {
    where: {
      id: id,
    },
  });
};

const getCartCustomer = async (id: number) => {
  return await CartItem.findAll({
    where: {
      id: id,
    },
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
  CartItem,
};
