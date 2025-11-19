// ============================================================
// 🧩 SignupController — Handles user sign-up logic
// ============================================================
import type { NextFunction, Request, Response } from "express";

// ------------------------------------------------------
// signupController() — Handles user sign-up requests
// ------------------------------------------------------
const signupController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate async operation

	if (!req.body.email || !req.body.password) {
		return next(new Error("Email and password are required"));
	}

	res.status(201).json({
		message: "User signed up successfully",
		user: {
			username: req.body.username,
			email: req.body.email,
			role: req.body.role || "user",
		},
	});
};

export default signupController;
