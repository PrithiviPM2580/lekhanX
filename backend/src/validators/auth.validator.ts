// ============================================================
// 🧩 AuthValidator — Validation for authentication routes
// ============================================================
import { z } from "zod";

// ------------------------------------------------------
// signupSchema{} — Validation schema for user signup
// ------------------------------------------------------
export const signupSchema = {
	body: z
		.object({
			username: z
				.string()
				.min(3, "Username must be at least 3 characters long"),
			email: z.string().email("Invalid email format"),
			password: z
				.string()
				.min(6, "Password must be at least 6 characters long"),
		})
		.strict(),
};

// ------------------------------------------------------
// loginSchema{} — Validation schema for user login
// ------------------------------------------------------
export const loginSchema = {
	body: z
		.object({
			email: z.string().email("Invalid email format"),
			password: z
				.string()
				.min(6, "Password must be at least 6 characters long"),
		})
		.strict(),
};

// ------------------------------------------------------
// Define the type defination of the schemas
// ------------------------------------------------------
export type SignupInput = z.infer<typeof signupSchema.body>;
export type LoginInput = z.infer<typeof loginSchema.body>;
