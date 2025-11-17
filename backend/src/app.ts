// ============================================================
// 🧩 App — Main application setup and configuration
// ============================================================

import express, { type Express } from "express";

const app: Express = express();

// ------------------------------------------------------
// Middlewares
// ------------------------------------------------------
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

export default app;
