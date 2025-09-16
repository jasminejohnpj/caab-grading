import { Sequelize, DataTypes } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } from "../config/env.js";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    dialect: DB_DIALECT,
    host: DB_HOST,
    logging: false,
});

const User = sequelize.define(
    "User",
    {
        caab_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "email cannot be empty" },
                len: {
                    args: [2, 500],
                    msg: "email must be between 2 and 500 characters",
                },
            },
        },
        user_name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: { msg: "Username cannot be empty" },
                len: {
                    args: [2, 500],
                    msg: "Username must be between 2 and 500 characters",
                },
            },
        },
        company_name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: { msg: "company name cannot be empty" },
                len: {
                    args: [2, 500],
                    msg: "company name must be between 2 and 500 characters",
                },
            },
        },
        mobile: {
            type: DataTypes.STRING(500),
            validate: {
                notEmpty: { msg: "mobile No cannot be empty" },
                len: {
                    args: [2, 500],
                    msg: "mobile No must be between 2 and 500 characters",
                },
            },
        },
        employer_category: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: { msg: "employer category cannot be empty" },
                len: {
                    args: [2, 500],
                    msg: "employer category must be between 2 and 500 characters",
                },
            },
        },
        role: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: { msg: "role cannot be empty" },
                len: {
                    args: [2, 500],
                    msg: "role must be between 2 and 500 characters",
                },
            },
        }
    }, { timestamps: true }
);

sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("User table created/updated successfully");
    })
    .catch((error) => {
        console.log("Error creating User table:", error);
    });

export default User;