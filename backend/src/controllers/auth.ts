import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/user';
import { AppError } from '../middleware/errorHandler';
import { generateToken, generateRefreshToken } from '../middleware/auth';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: IUser;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      loginAttempts: 0,
      twoFactorEnabled: false
    });

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Remove password from output
    user.password = undefined as any;

    res.status(201).json({
      status: 'success',
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and is not locked
    const user = await User.findOne({ email })
      .select('+password +loginAttempts +lockUntil +twoFactorSecret');
    
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const waitTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 1000 / 60);
      return next(new AppError(`Account is locked. Please try again in ${waitTime} minutes`, 423));
    }

    // Check password
    const isPasswordCorrect = await user.correctPassword(password);
    if (!isPasswordCorrect) {
      // Increment login attempts
      await User.incrementLoginAttempts(email);
      return next(new AppError('Invalid email or password', 401));
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Remove sensitive data from output
    user.password = undefined as any;
    user.twoFactorSecret = undefined as any;

    res.status(200).json({
      status: 'success',
      accessToken,
      refreshToken,
      user,
      requiresTwoFactor: user.twoFactorEnabled
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return next(new AppError('No refresh token provided', 401));
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: string };

    // Check if user exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User not found', 401));
    }

    // Generate new tokens
    const accessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      status: 'success',
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid refresh token', 401));
    }
    next(error);
  }
};

export const logout = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user) {
      // Update last activity
      await User.findByIdAndUpdate(req.user._id, {
        $set: { lastLogin: new Date() }
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const validateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (error) {
    next(error);
  }
}; 