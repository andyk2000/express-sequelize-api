import {createStore, getStores, getStoreID, deleteStore, updateStore} from "../models/Stores";
import { Request , Response} from "express";

const createNewStore = async (request: Request, response: Response) => {
    const {name, address, description, owner_id} = request.body;
    try {
        const data = await createStore({ name, address, description, owner_id });
        return response.status(201).json(data);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllStores = async (request: Request, response: Response) => {
    try{
        const data = await getStores();
        return response.status(200).json(data);
    }catch(error){
        console.log(error);
        return response.status(500).send("faild to get the data");
    }
}

const getStoreByID = async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);
    try{
        const storeData = await getStoreID({id: id});
        return response.status(200).json(storeData);

    }catch(err){
        console.log(err);
        response.status(500).send(`failed to get store with id${id}`)
    }
}

const deleteStoreData = async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);
    try {
        const deletedStore = await deleteStore({id: id});
        return response.status(200).json(deletedStore);
    } catch (error) {
        console.log(error);
        response.status(200).json(`failed to delete store with id${id}`)
    }
}

const updateStoreData = async (request: Request, response: Response) => {
    const id =parseInt(request.params.id);
    const {names, address, description, owner_id} = request.body;
    try {
        const updatedStore = await updateStore({names, address, description, owner_id}, {id: id});
        return response.status(200).json(updatedStore);
    } catch (error) {
        console.log(error);
        response.status(200).json(`failed to update the store with id${id}`)
    }
}

export {
    createNewStore,
    getAllStores,
    getStoreByID,
    deleteStoreData,
    updateStoreData
}