import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// Extend Request type to include csrfToken method
interface CsrfRequest extends Request<ParamsDictionary, any, any, ParsedQs> {
  csrfToken(): string;
}

// Configure CSRF protection middleware
export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
}) as (req: Request, res: Response, next: NextFunction) => void;

// CSRF error handler middleware
export const handleCSRF = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  // Handle CSRF token errors
  res.status(403).json({
    status: 'error',
    message: 'Invalid CSRF token. Form tampered with.',
  });
};

// Middleware to set CSRF token in response
export const setCSRFToken = (req: Request, res: Response, next: NextFunction) => {
  // Only set the token for API routes
  if (req.path.startsWith('/api') && (req as CsrfRequest).csrfToken) {
    res.cookie('XSRF-TOKEN', (req as CsrfRequest).csrfToken(), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }
  next();
};