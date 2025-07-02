import { DataTypes } from "sequelize";
import { sequelize } from "../../index.js";

const User = sequelize.define("User", {
  id_user: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  picture_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  descriptions: {
    type :DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: "users",
  timestamps: true,
});

export default User;
