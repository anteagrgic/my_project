import { NextFunction, Request, Response } from 'express';

/**
 * Ignores favicon.ico requests to prevent unneccessary error logging.
 */
export const ignoreFaviconMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end();
  } else {
    next();
  }
};
