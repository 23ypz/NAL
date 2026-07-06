import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const enableSSL = process.env.DB_ENABLE_SSL === "true";
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "academic_light",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  namedPlaceholders: true,
  enableKeepAlive: true,
  connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 10000),
  ssl: enableSSL
    ? {
        minVersion: "TLSv1.2",
        rejectUnauthorized
      }
    : undefined
});

export default pool;
