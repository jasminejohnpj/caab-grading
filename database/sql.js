/* eslint-disable no-undef */
import mysql from "mysql2/promise";
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } from "../config/env.js";

const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });

    console.log(`Connected to database in ${NODE_ENV} mode`);
    return connection;
  } catch (error) {
    console.error(`Error connecting to database in ${NODE_ENV} mode:`, error);
    process.exit(1);
  }
};

export default connectToDatabase;
