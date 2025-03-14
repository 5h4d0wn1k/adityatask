import express from 'express';
import { authenticate, restrictTo } from '../middleware/auth';
import { updateProfile, getProfile, updatePassword } from '../controllers/user';
import { validateRequest } from '../middleware/validateRequest';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
];

const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
];

// Protected routes
router.use(authenticate);

// Profile routes
router.get('/profile', getProfile);
router.patch('/profile', updateProfileValidation, validateRequest, updateProfile);
router.patch('/password', updatePasswordValidation, validateRequest, updatePassword);

export default router; 