import { DataTypes, Sequelize, Model, Optional, WhereOptions } from "sequelize";

interface CartAttributes {
  id: number;
  customerId: number;
  total_price: number;
}

interface CartCreationAttributes extends Optional<CartAttributes, "id"> {}

class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public id!: number;
  public customerId!: number;
  public total_price!: number;
}

const cartSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: "users",
      key: "id",
    },
  },
  total_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
};

const initializeCart = (sequelize: Sequelize) => {
  Cart.init(cartSchema, {
    sequelize,
    modelName: "cart",
    timestamps: false,
  });
};

const createCart = async (cart: CartCreationAttributes) => {
  return await Cart.create(cart);
};

const getCarts = async () => {
  const cartsData = await Cart.findAll();
  return cartsData;
};

const getCartID = async (query: NonNullable<unknown>) => {
  const cartData = await Cart.findOne({
    where: query,
  });
  return cartData;
};

const deleteCart = async (query: NonNullable<unknown>) => {
  return await Cart.destroy({
    where: query,
  });
};

const updateCart = async (
  data: NonNullable<unknown>,
  query: NonNullable<unknown>,
) => {
  return await Cart.update(data, {
    where: query,
  });
};

const updateCartTotalPrice = async (
  data: number,
  query: WhereOptions<Cart>,
) => {
  const updated = await Cart.update(
    {
      total_price: data,
    },
    {
      where: query,
      returning: true,
    },
  );
  return updated[1][0];
};

const findCartOwner = async (query: NonNullable<unknown>) => {
  return await Cart.findOne({
    where: query,
  });
};

export {
  initializeCart,
  createCart,
  getCarts,
  getCartID,
  deleteCart,
  updateCart,
  findCartOwner,
  updateCartTotalPrice,
  Cart,
};
