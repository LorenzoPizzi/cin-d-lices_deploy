import { DataTypes } from "sequelize";
import { sequelize } from "../../index.js";

const Role = sequelize.define("Role", {
  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: "roles",
  timestamps: false,
});

export default Role;
