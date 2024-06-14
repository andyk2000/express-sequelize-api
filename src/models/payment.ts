import { DataTypes, Sequelize, Model, Optional } from "sequelize";

interface PaymentAttributes {
  id: number;
  item_name: string;
  store_id: number;
  customer_id: number;
  amount: number;
  date: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id"> {}

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: number;
  public item_name!: string;
  public store_id!: number;
  public customer_id!: number;
  public amount!: number;
  public date!: Date;
}

const paymentSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "stores",
      key: "id",
    },
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
};

const initializePayment = (sequelize: Sequelize) => {
  Payment.init(paymentSchema, {
    sequelize,
    modelName: "payments",
    timestamps: false,
  });
};

const getPayments = async () => {
  const paymentsData = await Payment.findAll();
  return paymentsData;
};

const createPayment = async (store: PaymentCreationAttributes) => {
  return await Payment.create(store);
};

const getPaymentID = async (query: NonNullable<unknown>) => {
  const paymentData = await Payment.findOne({
    where: query,
  });
  return paymentData;
};

const deletePayment = async (query: NonNullable<unknown>) => {
  return await Payment.destroy({
    where: query,
  });
};

const updatePayment = async (
  data: NonNullable<unknown>,
  query: NonNullable<unknown>,
) => {
  return await Payment.update(data, {
    where: query,
  });
};

const getPaymentByStore = async (query: NonNullable<unknown>) => {
  const stores = await Payment.findAll({
    where: query,
  });
  return stores;
};

export {
  initializePayment,
  getPayments,
  getPaymentByStore,
  updatePayment,
  deletePayment,
  getPaymentID,
  createPayment,
  Payment,
};
