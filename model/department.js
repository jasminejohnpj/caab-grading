import { Sequelize, DataTypes } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } from "../config/env.js";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: DB_DIALECT,
  host: DB_HOST,
  logging: false,
});

const department = sequelize.define(
  "department",
  {
    department_name: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: {
        msg: "Department name must be unique",
      },
      validate: {
        notEmpty: { msg: "Department name cannot be empty" },
        len: {
          args: [2, 500],
          msg: "Department name must be between 2 and 500 characters",
        },
      },
    },

    department_type: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Department type cannot be empty" },
        len: {
          args: [2, 500],
          msg: "Department type must be between 2 and 500 characters",
        },
      },
    },

    appropriate_govt: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Appropriate govt cannot be empty" },
        len: {
          args: [2, 500],
          msg: "Appropriate govt must be between 2 and 500 characters",
        },
      },
    },
  },
  {
    timestamps: true,
    tableName: "departments",
  }
);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Department table created/updated successfully");
  })
  .catch((error) => {
    console.error("Error creating department table:", error);
  });

export default department;
