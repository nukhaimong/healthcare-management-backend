import { NextFunction, Request, Response } from 'express';
import z from 'zod';

export const validateRequest = (zodSchema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      return next(new Error('Request body is missing'));
    }

    if (req.body?.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedRequestData = zodSchema.safeParse(req.body);

    if (!parsedRequestData.success) {
      return next(parsedRequestData.error);
    }

    req.body = parsedRequestData.data;

    next();
  };
};
