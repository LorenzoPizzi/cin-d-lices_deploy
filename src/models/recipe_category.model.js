import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const RecipeCategory = sequelize.define(
    "RecipeCategory",
    {
        id_recipe: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "recipe",
                key: "id_recipe",
            },
            onUpdate: "CASCADE",
        },
        id_category: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "category",
                key: "id_category",
            },
            onUpdate: "CASCADE",
        },
    },
    {
        tableName: "recipeCategory",
        timestamps: false,
    }
);

export default RecipeCategory;
