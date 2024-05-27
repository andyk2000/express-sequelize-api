import { DataTypes, Deferrable } from 'sequelize';
import { User } from "./Users";

const Store = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    }
}

export default Store;