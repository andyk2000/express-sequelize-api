import { Request, Response } from "express";
import {
  getPaymentByCustomer,
  getPaymentByStore,
  getPaymentSearchByItem,
} from "../models/payment";
import { getStoreByOwnerForPayment } from "./StoreController";
import { getServiceCountByStoreID } from "./ServiceController";
import { getUserID, searchCustomerByName } from "../models/Users";

interface Data {
  item_name: string;
  amount: number;
  customer: string;
  date: Date;
}

const findPaymentByStore = async (store_id: number) => {
  try {
    const payments = await getPaymentByStore({ store_id });
    return payments.reduce((total, payment) => total + payment.amount, 0);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const findAllStorePayments = async (request: Request, response: Response) => {
  const owner_id = response.locals.user.id;
  let serviceCount = 0;
  let totalPayment = 0;

  try {
    const stores = await getStoreByOwnerForPayment(owner_id);

    await Promise.all(
      stores.map(async (store) => {
        const services = await getServiceCountByStoreID(store.id);
        serviceCount += services;
        const paymentByStore = await findPaymentByStore(store.id);
        totalPayment += paymentByStore;
        console.log(totalPayment);
      }),
    );

    return response.status(200).json({
      totalPayment,
      storeCount: stores.length,
      serviceCount,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

const findLatestTransaction = async (request: Request, response: Response) => {
  const owner_id = response.locals.user.id;
  try {
    const stores = await getStoreByOwnerForPayment(owner_id);
    const payments: Data[] = [];

    await Promise.all(
      stores.map(async (store) => {
        const storePayments = await getPaymentByStore({ store_id: store.id });
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

    const sortedPayments = payments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    response.status(200).json(sortedPayments.splice(0, 6));
  } catch (error) {
    console.error("Error fetching payments:", error);
    response
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const findServiceSold = async (request: Request, response: Response) => {
  const { store_id } = request.body;
  const all_payments: Data[] = [];
  try {
    const payments = await getPaymentByStore({ store_id: store_id });
    const paymentPromises = payments.map(async (payment) => {
      const user = await getUserID(payment.customer_id);
      if (user) {
        all_payments.push({
          item_name: payment.item_name,
          amount: payment.amount,
          customer: user.names,
          date: payment.date,
        });
      }
    });
    await Promise.all(paymentPromises);
    const sortedPayments = all_payments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return response.status(200).json(sortedPayments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return response
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const statRetrieval = async (request: Request, response: Response) => {
  const { store_id } = request.body;
  try {
    const payments = await getPaymentByStore({ store_id: store_id });

    let users: { id: number; recurrence: number; name: string }[] = [];
    let services: { name: string; recurrence: number }[] = [];

    for (const payment of payments) {
      const existingUser = users.find(
        (user) => user.id === payment.customer_id,
      );
      if (existingUser) {
        existingUser.recurrence++;
      } else {
        const user_name = await getUserID({ id: payment.customer_id });
        if (user_name) {
          users.push({
            id: payment.customer_id,
            recurrence: 1,
            name: user_name.names,
          });
        }
      }
    }

    for (const payment of payments) {
      const existingService = services.find(
        (service) => service.name === payment.item_name,
      );
      if (existingService) {
        existingService.recurrence++;
      } else {
        services.push({ name: payment.item_name, recurrence: 1 });
      }
    }

    users = users.sort((a, b) => b.recurrence - a.recurrence);
    services = services.sort((a, b) => b.recurrence - a.recurrence);

    if (users.length > 3) {
      users = users.splice(0, 2);
    }

    if (services.length > 3) {
      services = services.splice(0, 3);
    }

    response.status(200).json({ users, services });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "There was an error", error });
  }
};

const searchByItem = async (search: string, store_id: number) => {
  try {
    const payments = await getPaymentSearchByItem(search, store_id);
    const paymentWithUserPromises = payments.map(async (payment) => {
      const user = await getUserID(payment.customer_id);
      if (user) {
        return {
          item_name: payment.item_name,
          amount: payment.amount,
          customer: user.names,
          date: payment.date,
        };
      }
      return null;
    });

    const formattedPayments = await Promise.all(paymentWithUserPromises);

    const filteredPayments = formattedPayments.filter(
      (payment) => payment !== null,
    ) as Data[];

    console.log(filteredPayments);
    return filteredPayments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const searchByCustomer = async (
  search: string,
  store_id: number,
): Promise<Data[]> => {
  try {
    const customers = await searchCustomerByName(search);
    const paymentPromises = customers.map(async (customer) => {
      console.log(customer);
      return await getPaymentByCustomer({
        customer_id: customer.id,
        store_id: store_id,
      });
    });

    const paymentsArrays = await Promise.all(paymentPromises);
    const payments = paymentsArrays.flat();
    const paymentWithUserPromises = payments.map(async (payment) => {
      const user = await getUserID(payment.customer_id);
      if (user) {
        return {
          item_name: payment.item_name,
          amount: payment.amount,
          customer: user.names,
          date: payment.date,
        };
      }
      return null;
    });

    const formattedPayments = await Promise.all(paymentWithUserPromises);

    const filteredPayments = formattedPayments.filter(
      (payment) => payment !== null,
    ) as Data[];

    console.log(filteredPayments);
    return filteredPayments;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const searchPayments = async (request: Request, response: Response) => {
  const { category, search_string, store_id } = request.body;
  let payments;
  try {
    if (category === "customer") {
      payments = await searchByCustomer(search_string, store_id);
      console.log(payments);
    } else if (category === "item") {
      payments = await searchByItem(search_string, store_id);
    }
    return response.status(200).json(payments);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ message: "There was an error", error: error });
  }
};

export {
  findAllStorePayments,
  findLatestTransaction,
  findServiceSold,
  statRetrieval,
  searchPayments,
};
