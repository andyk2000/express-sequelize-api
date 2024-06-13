import { Request, Response } from "express";
import { getPaymentByStore } from "../models/payment";
import { getStoreByOwnerForPayment } from "./StoreController";

const findPaymentByStore = async (store_id: number) => {
  try {
    const payments = await getPaymentByStore({ store_id: store_id });
    return payments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findAllStorePayments = async (request: Request, response: Response) => {
  console.log(response.locals.user);
  const owner_id = response.locals.user.id;
  try {
    const stores = await getStoreByOwnerForPayment(owner_id);
    console.log(stores);
    //   let totalPayment = 0;
    const allStores = stores.map(async (store) => {
      return await findPaymentByStore(store.id);
    });
    console.log(allStores);
    return response.status(200).json(allStores);
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

export { findAllStorePayments };
