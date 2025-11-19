// ============================================================
// 🧩 App — Main application setup and configuration
// ============================================================
import express, { type Express } from "express";
import cookiePaeser from "cookie-parser";

// Initialize the Express application
const app: Express = express();

// ------------------------------------------------------
// Imports
// ------------------------------------------------------
import routes from "@/routes/index.route.js";
import globalErrorHandlerMiddleware from "./middlewares/global-error-handler.middleware.js";
import compression from "compression";
import requestTimerMiddleware from "./middlewares/request-timer.middleware.js";

// ------------------------------------------------------
// Middlewares
// ------------------------------------------------------
app.use(cookiePaeser()); // Parse cookies
app.use(compression); // Enable response compression
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(requestTimerMiddleware); // Middleware to track request time
app.use(routes); // Use main application routes
app.use(globalErrorHandlerMiddleware); // Global error handling middleware

export default app;
