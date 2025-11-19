import { z } from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	LOG_LEVEL: z.enum(["error", "warn", "info"]).default("info"),
	DB_URL: z.string().min(1, "DB_URL is required"),
	DB_NAME: z.string().min(1, "DB_NAME is required"),
	APP_NAME: z.string().min(1, "APP_NAME is required"),
	APP_VERSION: z.string().default("1").transform(String),
});

export default envSchema;
