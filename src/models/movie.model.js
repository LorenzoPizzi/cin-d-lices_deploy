import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const Movie = sequelize.define(
    "Movie",
    {
        id_movie: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tmdb_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "movie",
        timestamps: true,
    }
);

export default Movie;
