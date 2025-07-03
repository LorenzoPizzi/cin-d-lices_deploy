import { DataTypes } from "sequelize";
import sequelize  from "../db/sequelize.js";

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
  },
  id_role: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: "roles",
    key: "id_role",
  }
},
}, {
  tableName: "users",
  timestamps: true,
});

export default User;
