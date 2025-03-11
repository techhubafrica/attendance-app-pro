import { body, validationResult } from 'express-validator';

export const validateSignup = [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['employee', 'student', 'faculty', 'admin', 'teacher']).withMessage('Invalid role'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];
  
  export const validateLogin = [
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];

export const appointmentValidationRules = () => {
  return [
    body('date').isISO8601().toDate().withMessage('Invalid date'),
    body('startTime').isISO8601().toDate().withMessage('Invalid start time'),
    body('endTime').isISO8601().toDate().withMessage('Invalid end time'),
    body('purpose').notEmpty().withMessage('Purpose is required')
  ];
};

export const validateBookCreation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('isbn').notEmpty().withMessage('ISBN is required'),
  body('description').notEmpty().withMessage('Description cant be empty'),
  body('category').notEmpty().withMessage('Category is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
