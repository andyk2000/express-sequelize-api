import {createUser, getUsers, getUserID, deleteUser, updateUser, getUserEmail} from "../models/Users";
import { Request , Response} from "express";
import Crypto from "crypto";
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const generateAccessToken = (email: string, id: number) => {
    return jwt.sign(
      {
        id,
        email,
      },
      "muu",
      {
        expiresIn: 3600,
      }
    );
};

const confirmationEmail = (email: string) => {
    const sender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'youremail@gmail.com',
          pass: '**********'
        }
    });

    var newMail = {
        from: 'andyirimbere@gmail.com',
        to: email,
        subject: `welcome to urubuto`,
        text: 'Welcome to URUBUTO, the best platform to connect you with your customers and stores across Rwanda'
      };

      sender.sendMail(newMail, function(){
        console.log('Email sent: ');
      });
      

}

const createNewUser = async (request: Request, response: Response) => {
    const {names, email, password, role} = request.body;
    console.log({names, email, password, role})
    try {
        const data = await createUser({ names, email, password, role });
        console.log(data);
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
        return response.status(500).send("failed to get the data");
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

const encryptPassword = (password: string) => {
    const hash = Crypto.createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
};

const signUp = async (request: Request, response: Response) => {
    let {names, email, password, role} = request.body;
    password = encryptPassword(password);
    try {
        const newUser = await createUser({names, email, password, role});
        confirmationEmail(email);
        return response.status(200).json(newUser);
    } catch (error) {
        console.log(error);
        return response.status(200).send("could not creat the new user");
    }
}

const logIn = async (request: Request, response: Response) => {
    const {email, password} = request.body;
    const encrypted = encryptPassword(password);
    try {
        const user = await getUserEmail({email: email})
        if(user === null){
            return response.status(404).send("login failed try again");
        }
        if(user.password !== encrypted){
            return response.status(404).send("login failed try again");
        }
        const token = generateAccessToken(user.email, user.id);

        return response.status(200).send(token);

    } catch (error) {
        console.log(error);
        return response.status(500).send("failed to login");
    }
}

export {
    createNewUser,
    getAllUsers,
    getUserByID,
    deleteUserData,
    updateUserData,
    signUp,
    logIn
}