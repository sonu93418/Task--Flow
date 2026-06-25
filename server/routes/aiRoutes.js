import express from 'express';
import { suggestEstimate } from '../controllers/aiController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);
router.post('/suggest', suggestEstimate);

export default router;
