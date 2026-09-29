import type { Request, Response, NextFunction } from "express";

/**
 * Wraps async Express handlers to catch errors automatically without manual try/catch in every controller.
 */
export const asyncHandler =
  (fn: (req: Request | any, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * Global error handling middleware.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode || 500);
  const message = err.message || "An unexpected server error occurred.";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[Error] ${req.method} ${req.url}:`, err);
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};
