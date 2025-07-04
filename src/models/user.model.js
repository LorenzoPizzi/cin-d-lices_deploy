import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const User = sequelize.define(
    "User",
    {
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        email_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        id_role: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Role",
                key: "id_role",
            },
        },
    },
    {
        tableName: "users",
        timestamps: true,
    }
);

export default User;
