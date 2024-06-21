import { DataTypes, Sequelize, Model, Optional } from "sequelize";

interface StoreAttributes {
  id: number;
  name: string;
  address: string;
  description: string;
  userId: number;
  storeUrl: string;
}

interface StoreCreationAttributes extends Optional<StoreAttributes, "id"> {}

class Store
  extends Model<StoreAttributes, StoreCreationAttributes>
  implements StoreAttributes
{
  public id!: number;
  public name!: string;
  public address!: string;
  public description!: string;
  public userId!: number;
  public storeUrl!: string;
}

const storeSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: "users",
      key: "id",
    },
  },
  storeUrl: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
};

const initializeStore = (sequelize: Sequelize) => {
  Store.init(storeSchema, {
    sequelize,
    modelName: "store",
    timestamps: false,
  });
};

const getStores = async () => {
  const storesData = await Store.findAll();
  return storesData;
};

const createStore = async (store: StoreCreationAttributes) => {
  return await Store.create(store);
};

const getStoreID = async (id: number) => {
  const storeData = await Store.findOne({
    where: {
      id: id,
    },
  });
  return storeData;
};

const deleteStore = async (id: number) => {
  return await Store.destroy({
    where: {
      id: id,
    },
  });
};

const updateStore = async (
  data: NonNullable<unknown>,
  query: NonNullable<unknown>,
) => {
  return await Store.update(data, {
    where: query,
  });
};

const getStoreOwner = async (userId: number) => {
  const stores = await Store.findAll({
    where: {
      userId: userId,
    },
  });
  return stores;
};

const getstoresForCustomer = async () => {
  const stores = await Store.findAll({
    attributes: ["name", "address", "description", "storeUrl"],
  });
  return stores;
};

const getStoreInfo = async () => {
  const stores = await Store.findAll({
    attributes: ["id", "storeUrl"],
  });
  return stores;
};

const getStoreByName = async (storeName: string) => {
  const store = await Store.findOne({
    where: {
      name: storeName,
    },
  });
  return store;
};

const getStoreByUrl = async (url: string) => {
  const store = await Store.findOne({
    where: {
      storeUrl: url,
    },
  });
  return store?.id;
};

export {
  initializeStore,
  getStores,
  getStoreID,
  createStore,
  deleteStore,
  updateStore,
  getStoreOwner,
  getstoresForCustomer,
  getStoreInfo,
  getStoreByName,
  getStoreByUrl,
  Store,
};
