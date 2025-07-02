import { DataTypes } from "sequelize";
import { sequelize } from "../../index.js";

const Movie = sequelize.define("Movie", {
  id_movie: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "movie",
  timestamps: true, // pour created_at et updated_at
  createdAt: "created_at",
  updatedAt: "updated_at",
});

export default Movie; 