import { Request, Response, NextFunction } from "express";

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user || user.role !== "admin" || !user.isSuperAdmin) {
    return res.status(403).json({
      success: false,
      message: "Super Admin privileges required",
    });
  }

  next();
};
