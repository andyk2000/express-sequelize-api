import {createCart, updateCart, deleteCart, getCartID, getCarts, findCartOwner, Cart} from "../models/cart";
import { Request , Response} from "express";

const createNewCart = async (data: any) => {
    const firstPurchase = data;
    try {
        console.log(firstPurchase)
        const results = await createCart(firstPurchase);
        console.log(results);
        return firstPurchase;
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

const updateCartData = async (data: { item: object, price: number }, cart: Cart) => {
    const items = [...cart.items, data.item];
    const total_price = cart.total_price + data.price;
    const updatedCart = { items, total_price };

    try {
        const finalCart = await updateCart(updatedCart, { id: cart.id });
        return finalCart;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update cart");
    }
};

const findCartByCustomer = async (customer_id: any) => {
    return await findCartOwner({customer_id: customer_id})
}

const addItemToCart = async (request: Request, response: Response) => {
    const customer_id = request.headers["customerid"] as string;
    const { item, price } = request.body;
    console.log(customer_id)
    if (!customer_id) {
        return response.status(400).send("Customer ID is required");
    }

    try {
        let cart = await findCartByCustomer(customer_id);

        if (!cart) {
            cart = await createNewCart({ customer_id, items: [item], total_price: price });
        } else {
            await updateCartData({ item, price }, cart);
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