import { Request, Response } from "express";
import { Payment, getPaymentByStore } from "../models/payment";
import { getStoreByOwnerForPayment } from "./StoreController";
import { getServiceCountByStoreID } from "./ServiceController";
import { getUserID } from "../models/Users";
// import { getUserID } from "../models/Users";

interface Data {
  item_name: string;
  amount: number;
  customer: string;
  date: Date;
}

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

const findLatestTransaction = async (request: Request, response: Response) => {
  const owner_id = response.locals.user.id;
  try {
    const stores = await getStoreByOwnerForPayment(owner_id);
    const payments: Data[] = [];

    await Promise.all(
      stores.map(async (store) => {
        const storePayments = await getPaymentByStore(store.id);
        const paymentPromises = storePayments.map(async (payt) => {
          const user = await getUserID(payt.customer_id);
          if (user) {
            payments.push({
              item_name: payt.item_name,
              amount: payt.amount,
              customer: user.names,
              date: payt.date,
            });
          }
        });
        await Promise.all(paymentPromises);
      }),
    );

    response.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    response
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export { findAllStorePayments, findLatestTransaction };
