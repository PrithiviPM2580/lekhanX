// ============================================================
// 🧩 ValidateRequestMiddleware — Request Validation Middleware
// ============================================================
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import logger from "@/lib/logger.lib.js";
import { formatIssues } from "@/utils/index.util.js";
import APIError from "@/lib/api-error.lib.js";

// ------------------------------------------------------
// validatePart() —
// ------------------------------------------------------
const validatePart = (
  part: "body" | "query" | "params",
  schema: z.ZodTypeAny,
  req: Request,
  next: NextFunction
): boolean => {
  if (!schema) return true;

  const result = schema.safeParse(req[part]);

  if (!result.success) {
    const issues = formatIssues(result.error.issues);
    logger.error(`Validation error in request ${part}`, {
      label: "ValidateRequestMiddleware",
      issues,
    });
    next(
      new APIError(400, "Validation Error", {
        type: "ValidationError",
        details: issues,
      })
    );
    return false;
  }

  (req[part] as unknown) = result.data;
  return true;
};

// ------------------------------------------------------
// validateRequestMiddleware() — Description
// ------------------------------------------------------
const validateRequestMiddleware =
  (schema: RequestValidate) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const bodyValid = validatePart("body", schema.body, req, next);
      if (!bodyValid) return;
      const queryValid = validatePart("query", schema.query, req, next);
      if (!queryValid) return;
      const paramsValid = validatePart("params", schema.params, req, next);
      if (!paramsValid) return;
      next();
    } catch (error) {
      logger.error("Unexpected error in validation middleware", {
        label: "ValidateRequestMiddleware",
        error,
      });
      next(error);
    }
  };

export default validateRequestMiddleware;
