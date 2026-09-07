import { Request, Response, NextFunction } from "express";

export const requireRole = (role: "admin" | "driver") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};


