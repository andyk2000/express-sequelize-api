import { DataTypes, Sequelize, Model, Optional } from "sequelize";

interface UserAttributes {
  id: number;
  names: string;
  email: string;
  password: string;
  role: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public names!: string;
  public email!: string;
  public password!: string;
  public role!: string;
}

const userSchema = {
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
};

const initializeUser = (sequelize: Sequelize) => {
  User.init(userSchema, {
    sequelize,
    modelName: "user",
    timestamps: false,
  });
};

const createUser = async (user: UserCreationAttributes) => {
  return await User.create(user);
};

const getUsers = async () => {
  const usersData = await User.findAll();
  return usersData;
};

const getUserID = async (query: NonNullable<unknown>) => {
  const userData = await User.findOne({
    where: query,
  });
  return userData;
};

const getUserEmail = async (query: NonNullable<unknown>) => {
  const userData = await User.findOne({
    where: query,
  });
  return userData;
};

const deleteUser = async (query: NonNullable<unknown>) => {
  return await User.destroy({
    where: query,
  });
};

const updateUser = async (
  data: NonNullable<unknown>,
  query: NonNullable<unknown>,
) => {
  return await User.update(data, {
    where: query,
  });
};

export {
  initializeUser,
  createUser,
  getUsers,
  getUserID,
  deleteUser,
  updateUser,
  getUserEmail,
};
