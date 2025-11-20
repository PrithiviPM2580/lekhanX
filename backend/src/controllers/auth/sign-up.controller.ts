// ============================================================
// 🧩 SignupController — Handles user sign-up logic
// ============================================================

import type { NextFunction, Request, Response } from "express";
import APIError from "@/lib/api-error.lib.js";
import cookieLib from "@/lib/cookie.lib.js";
import { signupService } from "@/services/auth.service.js";
import { logRequest, successResponse } from "@/utils/index.util.js";
import type { SignupInput } from "@/validators/auth.validator.js";

// ------------------------------------------------------
// signupController() — Handles user sign-up requests
// ------------------------------------------------------
const signupController = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	// Call the signup service with user data and request
	const { user, accessToken, refreshToken } = await signupService(
		req.body as SignupInput,
		req,
	);

	// Handle potential failures
	if (!user) {
		// Log the failure for debugging and monitoring
		logRequest({
			req,
			res,
			message: "User sign-up failed",
			label: "SignupController",
		});

		// Pass an error to the next middleware
		return next(
			new APIError(500, "User sign-up failed", {
				type: "InternalServerError",
				details: [
					{
						field: "Signup",
						message: "User sign-up process failed",
					},
				],
			}),
		);
	}

	// Ensure tokens are generated
	if (!accessToken || !refreshToken) {
		// Log the failure for debugging and monitoring
		logRequest({
			req,
			res,
			message: "Token generation failed during sign-up",
			label: "SignupController",
		});

		// Pass an error to the next middleware
		return next(
			new APIError(500, "Token generation failed", {
				type: "InternalServerError",
				details: [
					{
						field: "Token",
						message: "Failed to generate access or refresh token",
					},
				],
			}),
		);
	}

	// Set the refresh token as an HTTP-only cookie
	cookieLib.setCookie(res, "refreshToken", refreshToken);

	// Log the successful sign-up request
	successResponse(req, res, 201, "User signed up successfully", {
		user,
		accessToken,
	});
};

export default signupController;
