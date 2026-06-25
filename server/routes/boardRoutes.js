import express from 'express';
import { getBoards, getBoard, createBoard, updateBoard, deleteBoard } from '../controllers/boardController.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createBoardSchema, updateBoardSchema } from '../validators/boardValidator.js';

const router = express.Router();

// All board routes require authentication
router.use(auth);

router.get('/', getBoards);
router.get('/:id', getBoard);
router.post('/', validate(createBoardSchema), createBoard);
router.put('/:id', validate(updateBoardSchema), updateBoard);
router.delete('/:id', deleteBoard);

export default router;
