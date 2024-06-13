import { Request, Response } from "express";
import { getPaymentByStore } from "../models/payment";
import { getStoreByOwnerForPayment } from "./StoreController";
import { getServiceCountByStoreID } from "./ServiceController";

const findPaymentByStore = async (store_id: number) => {
  try {
    const payments = await getPaymentByStore({ store_id: store_id });
    let totalAmountPaid = 0;
    payments.map((payment) => {
      totalAmountPaid = totalAmountPaid + payment.amount;
    });
    return totalAmountPaid;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findAllStorePayments = async (request: Request, response: Response) => {
  const owner_id = response.locals.user.id;
  let serviceCount = 0;
  try {
    const stores = await getStoreByOwnerForPayment(owner_id);
    let totalPayment = 0;
    await Promise.all(
      stores.map(async (store) => {
        const services = await getServiceCountByStoreID(store.id);
        serviceCount += services;
        totalPayment += await findPaymentByStore(store.id);
      }),
    );

    console.log(serviceCount);
    return response.status(200).json({
      totalPayment,
      storeCount: stores.length,
      serviceCount: serviceCount,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

export { findAllStorePayments };
