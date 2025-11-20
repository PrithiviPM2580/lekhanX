// ============================================================
// 🧩 LoginController — Handles user login requests
// ============================================================
import { LoginInput } from "@/validators/auth.validator.js";
import type { Request, Response, NextFunction } from "express";
import { loginService } from "@/services/auth.service.js";
import { logRequest, successResponse } from "@/utils/index.util.js";
import APIError from "@/lib/api-error.lib.js";
import cookieLib from "@/lib/cookie.lib.js";

// ------------------------------------------------------
// loginController() — Handles user login requests
// ------------------------------------------------------
const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Call the login service with user data and request
  const { user, accessToken, refreshToken } = await loginService(
    req.body as LoginInput,
    req
  );

  // Handle potential failures
  if (!user) {
    // Log the failure for debugging and monitoring
    logRequest({
      req,
      res,
      message: "Login failed: User not found after successful authentication",
      label: "LoginController",
    });

    // Pass an error to the next middleware
    return next(
      new APIError(500, "Login failed", {
        type: "InternalServerError",
        details: [
          {
            field: "Login",
            message: "User retrieval failed after authentication",
          },
        ],
      })
    );
  }

  // Ensure tokens are generated
  if (!accessToken || !refreshToken) {
    // Log the failure for debugging and monitoring
    logRequest({
      req,
      res,
      message: "Login failed: Token generation failed",
      label: "LoginController",
    });

    // Pass an error to the next middleware
    return next(
      new APIError(500, "Token generation failed", {
        type: "InternalServerError",
        details: [
          {
            field: "Token",
            message: "Access or refresh token generation failed",
          },
        ],
      })
    );
  }

  // Set the refresh token as an HTTP-only cookie
  cookieLib.setCookie(res, "refreshToken", refreshToken);

  // Log the successful login request
  successResponse(req, res, 200, "Login successful", {
    user,
    accessToken,
  });
};

export default loginController;
