import { Sequelize, DataTypes } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } from "../config/env.js";

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: DB_DIALECT,
  host: DB_HOST,
  logging: false,
});

const documents = sequelize.define(
  "documents",
  {
    branch_id: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: {
        msg: "branch id must be unique",
      },
      validate: {
        notEmpty: { msg: "branch id cannot be empty" },
        len: {
          args: [2, 500],
          msg: "branch id must be between 2 and 500 characters",
        },
      },
    },

    department_name: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "department name cannot be empty" },
        len: {
          args: [2, 500],
          msg: "department name must be between 2 and 500 characters",
        },
      },
    },

    document_description: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "document description cannot be empty" },
        len: {
          args: [2, 500],
          msg: "document description must be between 2 and 500 characters",
        },
      },
    },

    issue_date: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "issue date cannot be empty" },
        len: {
          args: [2, 500],
          msg: "issue date must be between 2 and 500 characters",
        },
      },
    },

    expiry_date: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "expiry date cannot be empty" },
        len: {
          args: [2, 500],
          msg: "expiry date must be between 2 and 500 characters",
        },
      },
    },

    licence_no: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "licence no cannot be empty" },
        len: {
          args: [2, 500],
          msg: "licence no must be between 2 and 500 characters",
        },
      },
    },

    licence_authority: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notEmpty: { msg: "licence authority cannot be empty" },
        len: {
          args: [2, 500],
          msg: "licence authority must be between 2 and 500 characters",
        },
      },
    },

    document_link: {
      type: DataTypes.STRING(500),
      validate: {
        notEmpty: { msg: "document link cannot be empty" },
        len: {
          args: [2, 500],
          msg: "document link must be between 2 and 500 characters",
        },
      },
    },
  },
  { timestamps: true }
);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("documents table created/updated successfully");
  })
  .catch((error) => {
    console.error("Error creating documents table:", error);
  });

export default documents;
