import express from 'express';
import { getTasks, createTask, getTask, updateTask, deleteTask, moveTask } from '../controllers/taskController.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema, moveTaskSchema } from '../validators/taskValidator.js';

const router = express.Router({ mergeParams: true });

// All task routes require authentication
router.use(auth);

router.get('/', getTasks);
router.post('/', validate(createTaskSchema), createTask);
router.get('/:id', getTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/move', validate(moveTaskSchema), moveTask);

export default router;
