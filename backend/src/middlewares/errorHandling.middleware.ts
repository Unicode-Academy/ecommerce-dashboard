/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { ErrorWithStatus } from "../types/error.type";

export const errorHandlingMiddleware = (
  error: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(error.message);
  return res.status(error.status || 500).json({
    message: error.message || "Server Error",
    success: false,
  });
};
