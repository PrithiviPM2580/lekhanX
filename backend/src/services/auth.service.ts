// ============================================================
// 🧩 AuthService — Handles authentication-related business logic
// ============================================================

import type { Request } from "express";
import config from "@/config/env.config.js";
import {
	createToken,
	createUser,
	isUserExistsByEmail,
} from "@/dao/auth.dao.js";
import APIError from "@/lib/api-error.lib.js";
import jwtLib from "@/lib/jwt.lib.js";
import logger from "@/lib/logger.lib.js";
import {
	generateMongooseId,
	getRefreshTokenExpiryDate,
} from "@/utils/index.util.js";
import type { SignupInput } from "@/validators/auth.validator.js";

// ------------------------------------------------------
// signupService() — Registers a new user
// ------------------------------------------------------
export const signupService = async (userData: SignupInput, req: Request) => {
	// Extract user data
	const { email } = userData;

	// Determine user role based on email
	const role = config.ADMIN_EMAIL.includes(email) ? "admin" : "user";

	// Check if user already exists
	const userExists = await isUserExistsByEmail(email);

	// Handle existing user case
	if (userExists) {
		//  Log the attempt for monitoring
		logger.warn(`Signup attempt with existing email: ${email}`, {
			label: "AuthService",
		});

		// Throw conflict error
		throw new APIError(409, "Email already in use", {
			type: "Conflict",
			details: [
				{
					field: "email",
					message: "A user with this email already exists",
				},
			],
		});
	}

	// Create new user ID
	const _id = generateMongooseId();

	// Create the new user
	const newUser = await createUser({
		_id,
		role,
		...userData,
	});

	// Generate access token
	const accessToken = jwtLib.generateAccessToken({
		userId: newUser._id.toString(),
		role: newUser.role,
	});

	// Generate refresh token
	const refreshToken = jwtLib.generateRefreshToken({
		userId: newUser._id.toString(),
		role: newUser.role,
	});

	// Store refresh token in database
	await createToken({
		_id: generateMongooseId(),
		userId: newUser._id,
		token: refreshToken,
		userAgent: req.headers["user-agent"] || "",
		ip: req.ip || req.socket.remoteAddress || "",
		expiresAt: getRefreshTokenExpiryDate(),
	});

	// Return user and tokens
	return {
		user: {
			_id: newUser._id,
			username: newUser.username,
			email: newUser.email,
			role: newUser.role,
		},
		accessToken,
		refreshToken,
	};
};
