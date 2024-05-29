import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { AllowNull } from 'sequelize-typescript';

// Define the attributes for the User model
interface StoreAttributes {
    id: number;
    name: string;
    address: string;
    description: string;
    owner_id: string;
    storeUrl: string;
}

// Define the attributes for creating a User (id is optional)
interface StoreCreationAttributes extends Optional<StoreAttributes, 'id'> {}

// Define the User model class
class Store extends Model<StoreAttributes, StoreCreationAttributes> implements StoreAttributes {
    public id!: number;
    public name!: string;
    public address!: string;
    public description!: string;
    public owner_id!: string;
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
        unique: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    storeUrl: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
}

const initializeStore = (sequelize: Sequelize) => {
    Store.init(storeSchema, {
        sequelize,
        modelName: 'store',
        timestamps: false,
    });
};

const getStores = async () => {
    const storesData = await Store.findAll();
    return storesData;
}

const createStore = async (store: StoreCreationAttributes) => {
    return await Store.create(store);
};

const getStoreID = async (query: {}) => {
    const storeData = await Store.findOne({
        where: query
    });
    return storeData;
}

const deleteStore = async (query: {}) => {
    return await Store.destroy({
        where: query
    })
}

const updateStore = async (data: {}, query: {}) => {
    return await Store.update(data, {
        where: query
    })
}

const getStoreOwner = async (query: {}) => {
    const stores = await Store.findAll({
        where: query
    });
    return stores;
}

const getstoresForCustomer = async () => {
    const stores = await Store.findAll({
        attributes: ['name', 'address', 'description', 'storeUrl']
    })
    return stores;
}

const getStoreInfo = async () => {
    const stores = await Store.findAll({
        attributes: ['id', 'storeUrl']
    })
    return stores;
}

export {
    initializeStore,
    getStores,
    getStoreID,
    createStore,
    deleteStore,
    updateStore,
    getStoreOwner,
    getstoresForCustomer,
    getStoreInfo
};