import {
  DataTypes,
  Sequelize,
  Model,
  Op,
  InferCreationAttributes,
  InferAttributes,
  CreationOptional,
  CreationAttributes,
} from "sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare names: string;
  declare email: string;
  declare password: string;
  declare role: string;
}

const initializeUser = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      names: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "customer",
      },
    },
    {
      sequelize,
      modelName: "user",
      timestamps: false,
    },
  );
};

const createUser = async (user: CreationAttributes<User>) => {
  return await User.create(user);
};

const getUsers = async () => {
  const usersData = await User.findAll();
  return usersData;
};

const getUserID = async (id: number) => {
  const userData = await User.findOne({
    where: {
      id: id,
    },
  });
  return userData;
};

const getUserEmail = async (email: string) => {
  const userData = await User.findOne({
    where: {
      email: email,
    },
  });
  return userData;
};

const deleteUser = async (id: number) => {
  return await User.destroy({
    where: {
      id: id,
    },
  });
};

const updateUser = async (data: NonNullable<unknown>, id: number) => {
  return await User.update(data, {
    where: {
      id: id,
    },
  });
};

const searchCustomerByName = async (search_string: string) => {
  const customers = await User.findAll({
    where: {
      names: {
        [Op.like]: `%${search_string}%`,
      },
      role: "customer",
    },
  });
  return customers;
};

export {
  initializeUser,
  createUser,
  getUsers,
  getUserID,
  deleteUser,
  updateUser,
  getUserEmail,
  searchCustomerByName,
  User,
};
