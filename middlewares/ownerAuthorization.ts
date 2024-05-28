import { Request, Response } from "express";
import {getUserID} from "../models/Users"

const ownerCheck = async (request: Request, response: Response, next: any) => {
    const ownerId = Number(request.headers["id"]);
    
    if(ownerId === null) {
        return response.status(500).json("provide an id");
    }

    try {
        console.log(ownerId);
        const owner = await getUserID({id: ownerId});
        if(!owner){
            return response.status(500).send(`there's no user with the id ${owner}`)
        }

        if(owner.role === "owner"){
            next();
        } else {
            return response.status(401).send("This user is not allowed to access the page required.");
        }


    } catch (error) {
        console.log(ownerId)
        console.log(error);
        return response.status(500).send("there was an error with this user");
    }

}

export default ownerCheck;