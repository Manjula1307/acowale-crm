import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { submitFeedback, getFeedback, getSummary, updateStatus } from '../controllers/feedbackController';
import { requireAuth } from '../middleware/authMiddleware';


const router = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many submissions, please try again later' },
});

const validateFeedback = [
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('comment').trim().isLength({ min: 3, max: 2000 }).withMessage('Comment must be 3-2000 characters'),
  body('email').optional({ values: 'falsy' }).isEmail().withMessage('Invalid email format'),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  },
];

router.post('/', submitLimiter, validateFeedback, submitFeedback);
router.get('/', requireAuth, getFeedback);
router.get('/summary', requireAuth, getSummary);
router.patch('/:id/status', requireAuth, updateStatus);


export default router;