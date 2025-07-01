import { DataTypes } from "sequelize";
import { sequelize } from "../index.js";

const Category = sequelize.define("Category", {
  id_category: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "category",
  timestamps: false,
});

export default Category; 