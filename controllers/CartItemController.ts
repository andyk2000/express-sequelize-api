import { CartItem } from "../models/CartItem";
import {createCartItem} from "../models/CartItem";

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

// const getAllStores = async (request: Request, response: Response) => {
//     try{
//         const data = await getStores();
//         return response.status(200).json(data);
//     }catch(error){
//         console.log(error);
//         return response.status(500).send("faild to get the data");
//     }
// }

// const getStoreByID = async (request: Request, response: Response) => {
//     const id = parseInt(request.params.id);
//     try{
//         const storeData = await getStoreID({id: id});
//         return response.status(200).json(storeData);

//     }catch(err){
//         console.log(err);
//         response.status(500).send(`failed to get store with id${id}`)
//     }
// }

// const deleteStoreData = async (request: Request, response: Response) => {
//     const id = parseInt(request.params.id);
//     try {
//         const deletedStore = await deleteStore({id: id});
//         return response.status(200).json(deletedStore);
//     } catch (error) {
//         console.log(error);
//         response.status(200).json(`failed to delete store with id${id}`)
//     }
// }

// const updateStoreData = async (request: Request, response: Response) => {
//     const id =parseInt(request.params.id);
//     const {names, address, description} = request.body;
//     try {
//         const updatedStore = await updateStore({names, address, description}, {id: id});
//         return response.status(200).json(updatedStore);
//     } catch (error) {
//         console.log(error);
//         response.status(200).json(`failed to update the store with id${id}`)
//     }
// }

// const  getStoreByOwner = async (request: Request, response: Response) => {
    
//     const id = Number(request.headers["id"]);
//     try {
//         const storeByowner = await getStoreOwner({owner_id: id});
//         console.log(storeByowner);
//         return response.status(200).json(storeByowner);
//     } catch (error) {  
//     }
// }

// const showAvailableShops = async (request: Request, response: Response) => {
//     try {
//         const availablestores = await getstoresForCustomer();
//         return response.status(200).json(availablestores);
//     } catch(error){
//         console.log(error);
//         return response.status(500).send("there is a problem with the server");
//     }
// }

export {
    createNewCartItem,
//     getAllStores,
//     getStoreByID,
//     deleteStoreData,
//     updateStoreData,
//     getStoreByOwner,
//     showAvailableShops,
}