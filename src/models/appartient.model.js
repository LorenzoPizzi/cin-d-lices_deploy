import { DataTypes } from "sequelize";
import { sequelize } from "../index.js";

const Appartient = sequelize.define("Appartient", {
  id_recipe: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: "recipe",
      key: "id_recipe",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  id_category: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: "category",
      key: "id_category",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
}, {
  tableName: "appartient",
  timestamps: false,
});

export default Appartient; 