import {
  createCart,
  findCartOwner,
  Cart,
  updateCartTotalPrice,
} from "../models/cart";
import { createNewCartItem, getCartItemBycart } from "./CartItemController";
import { Request, Response } from "express";
import { getServiceID } from "../models/Services";

const createNewCart = async (
  data: { total_price: number; customerId: number },
  item: string,
) => {
  const firstPurchase = data;
  try {
    const results = await createCart(firstPurchase);
    await createNewCartItem({
      cart_id: results.id,
      price: data.total_price,
      item_name: item,
    });
    return results;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateCartData = async (
  data: { item: string; price: number },
  cart: Cart,
) => {
  const total_price = cart.total_price + data.price;
  try {
    const finalCart = await updateCartTotalPrice(total_price, { id: cart.id });
    await createNewCartItem({
      cart_id: cart.id,
      item_name: data.item,
      price: data.price,
    });
    return finalCart;
  } catch (error) {
    console.log("couldn't update the cart", error);
    throw error;
  }
};

const findCartByCustomer = async (customerId: number) => {
  return await findCartOwner({ customerId: customerId });
};

const addItemsToCart = async (request: Request, response: Response) => {
  const { serviceId, customer } = request.body;
  const sId = parseInt(serviceId);
  const itemInfo = await findStoreItem(sId);
  const customerId = parseInt(customer);
  if (!customerId) {
    return response.status(400).json({ error: "Customer ID is required" });
  }
  if (!itemInfo) {
    return response.status(500).json({ error: "service not found" });
  } else {
    try {
      let cart = await findCartByCustomer(customerId);
      if (cart === null) {
        const total_price = itemInfo.dataValues.price;
        cart = await createNewCart(
          { customerId, total_price },
          itemInfo.dataValues.name,
        );
      } else {
        const item = itemInfo.dataValues.name;
        const price = itemInfo.dataValues.price;
        cart = await updateCartData({ item, price }, cart);
      }
      return response.status(200).json(cart);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: "Failed to add item to cart" });
    }
  }
};

const getCartByCustomer = async (request: Request, response: Response) => {
  const customer = response.locals.user.id;

  const cart = await findCartOwner({ customerId: customer });
  if (!cart) {
    return response.status(200).json(cart);
  }
  const cartItem = await getCartItemBycart(cart.id);
  const results = { cart, cartItem };
  return response.status(200).json(results);
};

const findStoreItem = async (id: number) => {
  try {
    const service = await getServiceID({ id: id });
    return service;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { addItemsToCart, getCartByCustomer };
