import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { AppError } from './errorHandler';
import { User, IUser } from '../models/user';

interface AuthRequest extends Request {
  user?: IUser;
}

interface TokenPayload extends JwtPayload {
  id: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Getting token and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (user.changedPasswordAfter(decoded.iat || 0)) {
      return next(
        new AppError('User recently changed password! Please log in again.', 401)
      );
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Authentication failed', 401));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

export const generateToken = (id: string): string => {
  const options: SignOptions = {
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600') // 1 hour in seconds
  };
  
  return jwt.sign(
    { id } as TokenPayload,
    process.env.JWT_SECRET!,
    options
  );
};

export const generateRefreshToken = (id: string): string => {
  const options: SignOptions = {
    expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '604800') // 7 days in seconds
  };
  
  return jwt.sign(
    { id } as TokenPayload,
    process.env.JWT_REFRESH_SECRET!,
    options
  );
}; 