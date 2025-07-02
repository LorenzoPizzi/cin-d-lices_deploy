import { DataTypes } from "sequelize";
import { sequelize } from "../../index.js";

const RecipeCategory = sequelize.define("RecipeCategory", {
  id_recipe: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: "recipe", 
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
  tableName: "recipeCategory", 
  timestamps: false,
});

export default RecipeCategory;
