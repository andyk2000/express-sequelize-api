import { Request, Response } from "express";
import {getUserID} from "../models/Users";

const customerCheck = async (request: Request, response: Response, next: any) => {
    const customerId = Number(request.headers["id"]);
    
    if(customerId === null) {
        return response.status(500).json("provide an id");
    }

    try {
        console.log(customerId);
        const customer = await getUserID({id: customerId});
        if(!customer){
            return response.status(500).send(`there's no user with the id ${customer}`)
        }

        if(customer.role === "customer"){
            next();
        } else {
            return response.status(401).send("This user is not allowed to access the page required.");
        }


    } catch (error) {
        console.log(customerId)
        console.log(error);
        return response.status(500).send("there was an error with this user");
    }
}

export {
    customerCheck,
}