import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

export const rateLimitMiddleware = (maxRequests: number, minutes: number) => {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response, next: NextFunction) => {
      console.log('rate limit');
      res
        .status(429)
        .json({ error: 'Too many requests, please try again later.' });
    },
  });
};
