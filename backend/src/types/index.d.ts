// ============================================================
// 🧩 Types — Type definitions
// ============================================================

import type { Request, Response } from "express";

// ------------------------------------------------------
// Global{} — Extend the global namespace
// ------------------------------------------------------
declare global {
	type APIErrorDetail = {
		field?: string;
		message?: string;
	};

	type APIErrorInfo = {
		type: string;
		details?: ErrorDetail[];
	};

	type APIErrorType = string | ErrorInfo;

	interface LogOptions {
		req: Request;
		res?: Response;
		message?: string;
		data?: unknown;
		error?: unknown;
		label?: string;
	}

	type RequestValidate = {
		body?: ZodTypeAny;
		query?: ZodTypeAny;
		params?: ZodTypeAny;
	};

	type TokenPayload = {
		userId: string;
		role: "admin" | "editor" | "author" | "user";
	};
}
