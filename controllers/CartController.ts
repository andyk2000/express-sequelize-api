import { number } from "joi";
import {createCart, updateCart, deleteCart, getCartID, getCarts, findCartOwner, Cart, updateCartTotalPrice} from "../models/cart";
import { createNewCartItem } from "./CartItemController";
import { Request , Response} from "express";
import { CartItem, updateCartItem } from "../models/CartItem";
import { getServiceID } from "../models/Services";

const createNewCart = async (data: {total_price: number, customerId: number}, item: string) => {
    const firstPurchase = data;
    try {
        const results = await createCart(firstPurchase);
        await createNewCartItem({cart_id: results.id, price: data.total_price, item_name: item});
        return results;
    } catch (error) {
        console.error(error);
        throw error;
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
        return finalCart;
    } catch (error) {
        console.log("couldn't update the cart", error);
        throw error;
    }
};

const findCartByCustomer = async (customerId: any) => {
    return await findCartOwner({customerId: customerId})
}

const addItemToCart = async (request: Request, response: Response) => {
    const { serviceId, customer } = request.body;
    const sId = parseInt(serviceId);
    const itemInfo = await findStoreItem(sId);
    let customerId =parseInt(customer);
    if (!customerId) {
        return response.status(400).send("Customer ID is required");
    }
    if(!itemInfo){
        return response.status(500).send("service not found");
    }else {
        try {
            let cart = await findCartByCustomer(customerId);
            if (cart === null) {
                const total_price = itemInfo.dataValues.price;
                cart = await createNewCart({ customerId, total_price}, itemInfo.dataValues.name);
            } else {
                const item = itemInfo.dataValues.name;
                const price = itemInfo.dataValues.price;
                cart = await updateCartData({ item, price }, cart);
            }
            return response.status(200).json(cart);
        } catch (error) {
            console.error(error);
            return response.status(500).json({error: "Failed to add item to cart"});
        }
    }
};

const findStoreItem = async (id: number) => {
    try {
        const service = await getServiceID({id: id});
        return service;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export {
    addItemToCart
}