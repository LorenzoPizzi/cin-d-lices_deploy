import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const Recipe = sequelize.define(
    "Recipe",
    {
        id_recipe: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        ingredients: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "recipe",
        timestamps: true,
        underscored: true,
    }
);

export default Recipe;
