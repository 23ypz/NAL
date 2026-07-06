import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

const sqlDir = path.resolve(__dirname, "../sql");

function requireEnv(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`缺少环境变量 ${name}`);
  }
  return value;
}

async function readSqlFile(fileName) {
  const filePath = path.join(sqlDir, fileName);
  return fs.readFile(filePath, "utf8");
}

function buildSslConfig() {
  if (process.env.DB_ENABLE_SSL !== "true") return undefined;
  return {
    minVersion: "TLSv1.2",
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false"
  };
}

async function main() {
  const host = requireEnv("DB_HOST", "localhost");
  const port = Number(requireEnv("DB_PORT", 3306));
  const user = requireEnv("DB_USER", "root");
  const password = requireEnv("DB_PASSWORD", "");

  const schemaSql = await readSqlFile("schema.sql");
  const seedSql = await readSqlFile("seed.sql");

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true,
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 10000),
    ssl: buildSslConfig()
  });

  console.log("开始导入 schema.sql ...");
  await connection.query(schemaSql);
  console.log("数据库和表结构创建完成。");

  console.log("开始导入 seed.sql ...");
  await connection.query(seedSql);
  console.log("初始数据写入完成。");

  await connection.end();
  console.log("MySQL / TiDB 初始化完成 ✅");
}

main().catch((error) => {
  console.error("初始化失败：", error);
  process.exit(1);
});
