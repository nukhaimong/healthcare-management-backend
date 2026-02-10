import { NextFunction, Request, Response } from 'express';
import z from 'zod';

export const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsedRequestData = zodSchema.safeParse(req.body);

    if (!parsedRequestData.success) {
      next(parsedRequestData.error);
    }

    req.body = parsedRequestData.data;

    next();
  };
};
