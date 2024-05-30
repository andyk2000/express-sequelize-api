import { number } from "joi";
import {createCart, updateCart, deleteCart, getCartID, getCarts, findCartOwner, Cart, updateCartTotalPrice} from "../models/cart";
import { createNewCartItem } from "./CartItemController";
import { Request , Response} from "express";
import { CartItem, updateCartItem } from "../models/CartItem";

const createNewCart = async (data: {total_price: number, customerId: number}, item: string) => {
    const firstPurchase = data;
    try {
        console.log(firstPurchase)
        const results = await createCart(firstPurchase);
        console.log(results);
        const newCartData = await createNewCartItem({cart_id: results.id, price: data.total_price, item_name: item});
        console.log(results, newCartData);
        return results;
    } catch (error) {
        console.error(error);
    }
}

// const getAllCarts = async (request: Request, response: Response) => {
//     try{
//         const data = await getCarts();
//         return response.status(200).json(data);
//     }catch(error){
//         console.log(error);
//         return response.status(500).send("failed to get the data");
//     }
// }

// const getCartByID = async (request: Request, response: Response) => {
//     const id = parseInt(request.params.id);
//     try{
//         const cartData = await getCartID({id: id});
//         return response.status(200).json(cartData);

//     }catch(err){
//         console.log(err);
//         response.status(500).send(`failed to get cart with id${id}`)
//     }
// }

// const deleteCartData = async (request: Request, response: Response) => {
//     const id = parseInt(request.params.id);
//     try {
//         const deletedCart = await deleteCart({id: id});
//         return response.status(200).json(deletedCart);
//     } catch (error) {
//         console.log(error);
//         response.status(200).json(`failed to delete cart with id${id}`)
//     }
// }

const updateCartData = async (data: { item: string, price: number }, cart: Cart) => {
    const total_price = cart.total_price + data.price;
    try {
        const finalCart = await updateCartTotalPrice(total_price, { id: cart.id });
        const newItem = await createNewCartItem({cart_id: cart.id, item_name: data.item, price: data.price})
        console.log(newItem);
        console.log(finalCart);
        return finalCart;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update cart");
    }
};

const findCartByCustomer = async (customerId: any) => {
    return await findCartOwner({customerId: customerId})
}

const addItemToCart = async (request: Request, response: Response) => {
    const { item, price, customer } = request.body;
    let total_price = parseInt(price);
    let customerId =parseInt(customer);
    console.log(customerId)
    if (!customerId) {
        return response.status(400).send("Customer ID is required");
    }

    try {
        let cart : any = await findCartByCustomer(customerId);
        console.log(cart);
        if (cart === null || cart === undefined) {
            cart = await createNewCart({ customerId, total_price}, item);
        } else {
            cart.total_price = cart.total_price + total_price;
            cart = await updateCartData({ item, price }, cart);
        }
        return response.status(200).json(cart);
    } catch (error) {
        console.error(error);
        return response.status(500).send("Failed to add item to cart");
    }
};

export {
    addItemToCart
}