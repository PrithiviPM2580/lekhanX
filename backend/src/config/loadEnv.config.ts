// ============================================================
// 🧩 LoadEnvConfig — Loads environment variables configuration
// ============================================================
import dotenv from "dotenv";
import path from "node:path";

const ENV = process.env.NODE_ENV || "development";

const envFile = `.env.${ENV}`;

dotenv.config({
  path: path.resolve(process.cwd(), envFile),
});
