import { getCartCustomer, createCartItem } from "../models/CartItem";

const createNewCartItem = async (newCartItem: {
  cartId: number;
  item_name: string;
  price: number;
  storeId: number;
}) => {
  const cartId = newCartItem.cartId;
  const item_name = newCartItem.item_name;
  const price = newCartItem.price;
  const storeId = newCartItem.storeId;
  try {
    const data = await createCartItem({ cartId, item_name, price, storeId });
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getCartItemBycart = async (Cart: number) => {
  const cartId = Cart;
  try {
    const results = await getCartCustomer(cartId);
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { createNewCartItem, getCartItemBycart };
