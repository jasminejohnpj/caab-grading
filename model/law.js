import { Sequelize, DataTypes } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } from "../config/env.js";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: DB_DIALECT,
  host: DB_HOST,
  logging: false,
});

const laws = sequelize.define(
  "laws",
  {
    department_name: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Department name cannot be empty" },
        len: {
          args: [2, 500],
          msg: "department name must be between 2 and 500 characters",
        },
      },
    },
    law: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "law cannot be empty" },
        len: {
          args: [2, 500],
          msg: "law must be between 2 and 500 characters",
        },
      },

    },
    act_rule: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "act/rule cannot be empty" },
        len: {
          args: [2, 500],
          msg: "act/rule must be between 2 and 500 characters",
        },
      },
    },
    section: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "section cannot be empty" },
        len: {
          args: [2, 500],
          msg: "section must be between 2 and 500 characters",
        },
      },

    },
    penalty_amount: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "penalty amount cannot be empty" },
        len: {
          args: [2, 500],
          msg: "penalty amount must be between 2 and 500 characters",
        },
      },
    },
    due_date: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "due date cannot be empty" },
        len: {
          args: [2, 500],
          msg: "due date must be between 2 and 500 characters",
        },
      },
    },
    alert_date: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "alert date cannot be empty" },
        len: {
          args: [2, 500],
          msg: "alert date must be between 2 and 500 characters",
        },
      },
    }
  }, { timestamps: true }
);
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("laws table created/updated successfully");
  })
  .catch((error) => {
    console.log("Error creating laws table:", error);
  });

export default laws;
