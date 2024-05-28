import {createUser, getUsers, getUserID, deleteUser, updateUser} from "../models/Users";
import { Request , Response} from "express";

const createNewUser = async (request: Request, response: Response) => {
    const {names, email, password, role} = request.body;
    try {
        const data = await createUser({ names, email, password, role });
        return response.status(201).json(data);
    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}

const getAllUsers = async (request: Request, response: Response) => {
    try{
        const data = await getUsers();
        return response.status(200).json(data);
    }catch(error){
        console.log(error);
        return response.status(500).send("faild to get the data");
    }
}

const getUserByID = async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);
    try{
        const userData = await getUserID({id: id});
        return response.status(200).json(userData);

    }catch(err){
        console.log(err);
        response.status(500).send(`failed to get user with id${id}`)
    }
}

const deleteUserData = async (request: Request, response: Response) => {
    const id = parseInt(request.params.id);
    try {
        const deletedUser = await deleteUser({id: id});
        return response.status(200).json(deletedUser);
    } catch (error) {
        console.log(error);
        response.status(200).json(`failed to delete user with id${id}`)
    }
}

const updateUserData = async (request: Request, response: Response) => {
    const id =parseInt(request.params.id);
    const {names, email, password, role} = request.body;
    try {
        const updatedUser = await updateUser({names, email, password, role}, {id: id});
        return response.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        response.status(200).json(`failed to update the user with id${id}`)
    }
}

export {
    createNewUser,
    getAllUsers,
    getUserByID,
    deleteUserData,
    updateUserData
}