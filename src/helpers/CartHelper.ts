import { logger } from "../../logger";
import {
  Cart,
  createCart,
  findCartOwner,
  updateCartTotalPrice,
} from "../models/cart";
import { getServiceID } from "../models/Services";
import { createNewCartItem } from "./CartItemHelper";

const createNewCart = async (
  data: { total_price: number; userId: number; storeId: number },
  item: string,
) => {
  const firstPurchase = data;
  try {
    const results = await createCart(firstPurchase);
    await createNewCartItem({
      cartId: results.id,
      price: data.total_price,
      item_name: item,
      storeId: data.storeId,
    });
    return results;
  } catch (error) {
    logger.error(
      `Error creating new cart for customer with Id: ${data.userId}`,
      error,
    );
    throw error;
  }
};

const updateCartData = async (
  data: { item: string; price: number; storeId: number },
  cart: Cart,
) => {
  const total_price = cart.total_price + data.price;
  try {
    const finalCart = await updateCartTotalPrice(total_price, cart.id);
    await createNewCartItem({
      cartId: cart.id,
      item_name: data.item,
      price: data.price,
      storeId: data.storeId,
    });
    return finalCart;
  } catch (error) {
    logger.error(`Error updating cart with: ${cart.id}`, error);
    throw error;
  }
};

const findCartByCustomer = async (userId: number) => {
  return await findCartOwner(userId);
};

const findStoreItem = async (id: number) => {
  try {
    const service = await getServiceID(id);
    return service;
  } catch (error) {
    logger.error(`Error getting service with Id: ${id}`, error);
    throw error;
  }
};

export { findStoreItem, findCartByCustomer, updateCartData, createNewCart };
