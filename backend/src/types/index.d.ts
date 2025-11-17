// ============================================================
// 🧩 Types — Type definitions
// ============================================================

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
}

export {};
