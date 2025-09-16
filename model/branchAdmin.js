import { Sequelize, DataTypes } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } from "../config/env.js";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    dialect: DB_DIALECT,
    host: DB_HOST,
    logging: false,
});

const branchAdmin = sequelize.define(
    "branchAdmin",
    {
        caab_id: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: { msg: "caab id cannot be empty" } },
        },
        branch_name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: { msg: "branch name cannot be empty" },
                len: { args: [2, 500], msg: "branch name must be between 2 and 500 characters" },
            },
        },
        branch_id: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: { msg: "branch id cannot be empty" },
                len: { args: [2, 500], msg: "branch id must be between 2 and 500 characters" },
            },
        },
        branch_email: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: { msg: "branch email cannot be empty" },
                isEmail: { msg: "branch email must be valid" },
            },
        },
        branch_mobile_no: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: { notEmpty: { msg: "branch mobile no cannot be empty" } },
        },
        branch_admin_name: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: { notEmpty: { msg: "branch admin name cannot be empty" } },
        },
        admin_no: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: { notEmpty: { msg: "admin no cannot be empty" } },
        },
        admin_email: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: { msg: "admin email cannot be empty" },
                isEmail: { msg: "admin email must be valid" },
            },
        },
        city: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: { notEmpty: { msg: "city cannot be empty" } },
        },
        district: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: { notEmpty: { msg: "district cannot be empty" } },
        },
        business_type: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: { notEmpty: { msg: "business type cannot be empty" } },
        },
        no_female: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        total_employees: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        no_contract: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        no_migrant: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        role: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: { notEmpty: { msg: "Role cannot be empty" } },
        },
    },
    {
        timestamps: true,
        tableName: "branchAdmins",
    }
);

sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("branchAdmin table created/updated successfully");
    })
    .catch((error) => {
        console.error("Error creating branchAdmin table:", error);
    });

export default branchAdmin;
