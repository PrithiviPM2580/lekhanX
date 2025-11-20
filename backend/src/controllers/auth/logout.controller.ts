// ============================================================
// 🧩 LogoutController — Handles user logout
// ============================================================
import APIError from "@/lib/api-error.lib.js";
import cookieLib from "@/lib/cookie.lib.js";
import jwtLib from "@/lib/jwt.lib.js";
import { logRequest, successResponse } from "@/utils/index.util.js";
import type { Request, Response, NextFunction } from "express";
import { logoutService } from "@/services/auth.service.js";
import { log } from "console";

// ------------------------------------------------------
// logoutController() — Handles user logout
// ------------------------------------------------------
const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const refreshToken = cookieLib.getCookie(req, "refreshToken");

  if (!refreshToken) {
    logRequest({
      req,
      res,
      message: "Refresh token missing during logout",
      label: "LogoutController",
    });
    return next(
      new APIError(400, "Refresh token missing", {
        type: "RefreshTokenMissing",
        details: [
          {
            field: "refreshToken",
            message: "Refresh token is required for logout",
          },
        ],
      })
    );
  }

  const payload = jwtLib.verifyRefreshToken(refreshToken);

  const isLogout = await logoutService(refreshToken);

  if (!isLogout) {
    logRequest({
      req,
      res,
      message: "Failed to logout user",
      label: "LogoutController",
    });
    return next(
      new APIError(500, "Failed to logout user", {
        type: "LogoutError",
        details: [
          {
            field: "refreshToken",
            message: "Failed to delete refresh token during logout",
          },
        ],
      })
    );
  }

  cookieLib.clearCookie(res, "refreshToken");

  logRequest({
    req,
    res,
    message: `User ${payload.userId} logged out successfully`,
    label: "LogoutController",
  });

  successResponse(req, res, 200, "Logged out successfully");
};

export default logoutController;
