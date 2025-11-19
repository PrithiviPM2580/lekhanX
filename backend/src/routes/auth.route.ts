// ============================================================
// 🧩 AuthRoute — Authentication routes
// ============================================================

import { Router } from "express";
import signupController from "@/controllers/auth/sign-up.controller.js";
import asyncHandlerMiddleware from "@/middlewares/async-handler.middleware.js";
import {
	limiters,
	rateLimitingMiddleware,
} from "@/middlewares/rate-limiting.middleware.js";
import validateRequestMiddleware from "@/middlewares/validate-request.middleware.js";
import { signupSchema } from "@/validators/auth.validator.js";

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

export default router;
