import { getCartCustomer } from "../models/CartItem";
import { createCartItem } from "../models/CartItem";
import {
  getStoreID,
  getStoreOwner,
  getStores,
  getstoresForCustomer,
  updateStore,
} from "../models/Stores";

const createNewCartItem = async (newCartItem: any) => {
  const cart_id = newCartItem.cart_id;
  const item_name = newCartItem.item_name;
  const price = newCartItem.price;
  try {
    const data = await createCartItem({ cart_id, item_name, price });
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getCartItemBycart = async (Cart: any) => {
  const cart_id = Cart;
  try {
    const results = await getCartCustomer({ cart_id: cart_id });
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { createNewCartItem, getCartItemBycart };
