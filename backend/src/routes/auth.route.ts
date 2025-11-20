// ============================================================
// 🧩 AuthRoute — Authentication routes
// ============================================================

import { Router } from "express";
import loginController from "@/controllers/auth/login.controller.js";
import logoutController from "@/controllers/auth/logout.controller.js";
import signupController from "@/controllers/auth/sign-up.controller.js";
import asyncHandlerMiddleware from "@/middlewares/async-handler.middleware.js";
import authenticateMiddleware from "@/middlewares/authenticate.middleware.js";
import {
	limiters,
	rateLimitingMiddleware,
} from "@/middlewares/rate-limiting.middleware.js";
import validateRequestMiddleware from "@/middlewares/validate-request.middleware.js";
import { loginSchema, signupSchema } from "@/validators/auth.validator.js";

// Initialize the router
const router: Router = Router();

// ------------------------------------------------------
// Signup Route
// ------------------------------------------------------
router.route("/sign-up").post(
	validateRequestMiddleware(signupSchema),
	rateLimitingMiddleware(limiters.user, (req) => req.ip as string),
	asyncHandlerMiddleware(signupController),
);

// ------------------------------------------------------
// Login Route
// ------------------------------------------------------
router.route("/login").post(
	validateRequestMiddleware(loginSchema),
	rateLimitingMiddleware(limiters.user, (req) => req.ip as string),
	asyncHandlerMiddleware(loginController),
);

// ------------------------------------------------------
// Logout Route
// ------------------------------------------------------
router.route("/lgout").post(
	authenticateMiddleware(["user"]),
	rateLimitingMiddleware(limiters.user, (req) => req.user?.userId as string),
	asyncHandlerMiddleware(logoutController),
);
export default router;
