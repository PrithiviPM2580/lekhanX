// ============================================================
// 🧩 AuthService — Handles authentication-related business logic
// ============================================================

import type { Request } from "express";
import config from "@/config/env.config.js";
import {
	createToken,
	createUser,
	findUserByEmail,
	isUserExistsByEmail,
} from "@/dao/auth.dao.js";
import APIError from "@/lib/api-error.lib.js";
import jwtLib from "@/lib/jwt.lib.js";
import logger from "@/lib/logger.lib.js";
import {
	generateMongooseId,
	getRefreshTokenExpiryDate,
} from "@/utils/index.util.js";
import type { LoginInput, SignupInput } from "@/validators/auth.validator.js";

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

// ------------------------------------------------------
// loginService() — Authenticates a user and generates tokens
// ------------------------------------------------------
export const loginService = async (loginData: LoginInput, req: Request) => {
	// Extract email and password
	const { email, password } = loginData;

	// Find user by email
	const user = await findUserByEmail(email);

	// Handle user not found case
	if (!user) {
		// Log the failed login attempt
		logger.error(`Login attempt with non-existing email: ${email}`, {
			label: "AuthService",
		});

		// Throw authentication error
		throw new APIError(401, "Invalid email or password", {
			type: "AuthenticationError",
			details: [
				{
					field: "email",
					message: "No user found with this email",
				},
			],
		});
	}

	// Verify password
	if (!user.comparePassword) {
		// Log the missing method error
		logger.error(
			`Password comparison method not found for intern with email: ${email}`,
			{
				label: "AuthService",
			},
		);

		// Throw internal server error
		throw new APIError(500, "Internal Server Error", {
			type: "InternalError",
			details: [
				{
					field: "password",
					message: "Password comparison method not implemented",
				},
			],
		});
	}

	// Check if the provided password is valid
	const isPasswordValid = await user.comparePassword(password);

	// Handle invalid password case
	if (!isPasswordValid) {
		// Log the invalid password attempt
		logger.warn(`Invalid password attempt for email: ${email}`, {
			label: "AuthService",
		});

		// Throw authentication error
		throw new APIError(401, "Invalid email or password", {
			type: "AuthenticationError",
			details: [
				{
					field: "password",
					message: "Incorrect password",
				},
			],
		});
	}

	// Generate access token
	const accessToken = jwtLib.generateAccessToken({
		userId: user._id.toString(),
		role: user.role,
	});

	// Generate refresh token
	const refreshToken = jwtLib.generateRefreshToken({
		userId: user._id.toString(),
		role: user.role,
	});

	// Store refresh token in database
	await createToken({
		_id: generateMongooseId(),
		userId: user._id,
		token: refreshToken,
		userAgent: req.headers["user-agent"] || "",
		ip: req.ip || req.socket.remoteAddress || "",
		expiresAt: getRefreshTokenExpiryDate(),
	});

	// Return user and tokens
	return {
		user: {
			_id: user._id,
			username: user.username,
			email: user.email,
			role: user.role,
		},
		accessToken,
		refreshToken,
	};
};
