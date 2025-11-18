// ============================================================
// 🧩 IndexUtils — Utility functions for index operations
// ============================================================

import logger from "@/lib/logger.lib.js";

// ------------------------------------------------------
// 1️⃣ timeStampToDate() — Returns the current timestamp as an ISO string
// ------------------------------------------------------
export const timeStampToDate = () => {
  return new Date().toISOString();
};

// ------------------------------------------------------
// 2️⃣ logRequest() — Logs details of an incoming request
// ------------------------------------------------------
export const logRequest = ({ req, res, message, data, error }: LogOptions) => {
  // Calculate response time if response object is provided
  const responseTime = `${Date.now() - (res?.locals.startTime || 0)}ms`;

  // Prepare metadata for logging
  const meta: Record<string, unknown> = {
    timestamp: timeStampToDate(),
    method: req.method,
    url: req.originalUrl,
    baseUrl: req.baseUrl || "",
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.headers["user-agent"] || "",
    body: req.body || {},
    query: req.query || {},
    params: req.params || {},
    statusCode: res?.statusCode,
    responseTime,
  };

  // Add additional data to metadata if provided
  if (data) meta.data = data;

  // Add error details to metadata if provided
  if (error) meta.error = error;

  // Log as error or info based on presence of an error
  error
    ? logger.error(message || "Request Error", meta)
    : logger.info(message || "Request Info", meta);
};
