import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

export const validate =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = await schema.parseAsync(req.body);
      req.body = body;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validate failed",
          errors: Object.fromEntries(
            error.issues.map(({ path, message }) => [path[0], message]),
          ),
        });
      }
    }
  };
