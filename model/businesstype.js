import { Sequelize, DataTypes } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } from "../config/env.js";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: DB_DIALECT,
  host: DB_HOST,
  logging: false,
});

const businesstype = sequelize.define(
  "businesstype",
  {
    business_type: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "business type cannot be empty" },
        len: {
          args: [2, 500],
          msg: "business type must be between 2 and 500 characters",
        },
      },
    },
    department_name: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notEmpty: { msg: "department name cannot be empty" },
        len: {
          args: [2, 500],
          msg: "department name must be at least 2 characters long",
        },
      },
    },
  }, { timestamps: true }
);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("businesstype table created/updated successfully");
  })
  .catch((error) => {
    console.log("Error creating businesstype table:", error)
  });


export default businesstype;