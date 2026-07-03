import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { submitFeedback, getFeedback, getSummary } from '../controllers/feedbackController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many submissions, please try again later' },
});

router.post('/', submitLimiter, submitFeedback);       // public
router.get('/', requireAuth, getFeedback);              // admin only
router.get('/summary', requireAuth, getSummary);        // admin only

export default router;