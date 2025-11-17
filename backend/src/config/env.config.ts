// ============================================================
// 🧩 EnvConfig — Environment configuration
// ============================================================
import "dotenv/config";
import envSchema from "@/validators/env.validator.js";
import validate from "@/lib/validate.lib.js";

// ------------------------------------------------------
// validateEnv{} — Validates environment variables
// ------------------------------------------------------
const envConfig = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
};

// Validate and export the environment configuration
const config = validate(envSchema, envConfig);

export default config;
