import { CartItem } from "../models/CartItem";
import {createCartItem} from "../models/CartItem";
import { getStoreID, getStoreOwner, getStores, getstoresForCustomer, updateStore } from "../models/Stores";

const createNewCartItem = async (newCartItem: any) => {
    const cart_id = newCartItem.cart_id;
    const item_name = newCartItem.item_name;
    const price = newCartItem.price;
    try {
        const data = await createCartItem({cart_id, item_name, price});
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export {
    createNewCartItem,
}