import { DataTypes, Deferrable } from 'sequelize';
import { Store } from "./Stores";

const Service = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    store_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Store,
            key: 'id',
            deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
    }
}

export { Service };