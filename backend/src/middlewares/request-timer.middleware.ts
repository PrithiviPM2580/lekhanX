// ============================================================
// 🧩 RequestTimerMiddleware — Measures and logs request duration
// ============================================================

import type { NextFunction, Request, Response } from "express";

// ------------------------------------------------------
// requestTimerMiddleware() — Measures and logs request duration
// ------------------------------------------------------
const requestTimerMiddleware = (
	_req: Request,
	res: Response,
	next: NextFunction,
) => {
	// Store the start time of the request
	res.locals.startTime = Date.now();

	// Listen for the finish event to calculate and log the duration
	res.on("finish", () => {
		// Calculate the duration and store it in res.locals
		const duration = Date.now() - res.locals.startTime;

		// Store the duration as a string with "ms" suffix
		res.locals.startTime = `${duration}ms`;
	});
	next();
};

export default requestTimerMiddleware;
