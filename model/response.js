import { Sequelize, DataTypes } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } from "../config/env.js";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    dialect: DB_DIALECT,
    host: DB_HOST,
    logging: false,
});

const questionResponse = sequelize.define(
    "questionResponse",
    {
        branch_id: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: { msg: "branch id cannot be empty" },
                len: {
                    args: [2, 500],
                    msg: "branch id must be between 2 and 500 characters",
                },
            },
        },
        section: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "section cannot be empty" },
                len: {
                    args: [2, 500],
                    msg: "section must be between 2 and 500 characters",
                },
            },
        },
        questions: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "questions cannot be empty" },
                len: {
                    args: [2, 500],
                    msg: "questions must be between 2 and 500 characters",
                },
            },
        },
        gravity: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "gravity cannot be empty" },
                len: {
                    args: [2, 500],
                    msg: "gravity must be between 2 and 500 characters",
                },
            },
        },
        response: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "section cannot be empty" },
                len: {
                    args: [2, 500],
                    msg: "section must be between 2 and 500 characters",
                },
            },
        }
    }, { timestamps: true }
);
sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("Questions table created/updated successfully");
    })
    .catch((error) => {
        console.log("Error creating Questions table:", error);
    });


export default questionResponse;