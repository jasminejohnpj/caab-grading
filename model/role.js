import { Sequelize, DataTypes } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } from "../config/env.js";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    dialect: DB_DIALECT,
    host: DB_HOST,
    logging: false,
});

const roles = sequelize.define(
    "roles",
    {
        role_name:{
            type:DataTypes.STRING,
            allowNull:false,
             validate: {
                notEmpty: { msg: "role  cannot be empty" },
                len: { args: [2, 500], msg: "role  must be between 2 and 500 characters" },
            },
        },
       access:{
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
                notEmpty: { msg: "access  cannot be empty" },
                len: { args: [2, 500], msg: "access  must be between 2 and 500 characters" },
            },
       } ,
       allowed_routes:{
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
                notEmpty: { msg: "allowed routes  cannot be empty" },
                len: { args: [2, 500], msg: "allowed routes  must be between 2 and 500 characters" },
            },
       }

    },{timestamps:true}
);

sequelize
.sync({ alter: true })
    .then(() => {
        console.log("roles table created/updated successfully");
    })
    .catch((error) => {
        console.error("Error creating roles table:", error);
    });

export default roles;
