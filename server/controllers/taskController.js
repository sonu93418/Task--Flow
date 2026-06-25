import Task from '../models/Task.js';
import Board from '../models/Board.js';

// Helper: verify board ownership
const verifyBoardOwnership = async (boardId, userId) => {
  const board = await Board.findOne({ _id: boardId, owner: userId });
  return board;
};

// GET /api/boards/:boardId/tasks
export const getTasks = async (req, res, next) => {
  try {
    const board = await verifyBoardOwnership(req.params.boardId, req.user.id);
    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found.' });
    }

    const { status, priority, sort, search } = req.query;
    const filter = { board: board._id, owner: req.user.id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { position: 1, createdAt: -1 };
    if (sort === 'dueDate') sortOption = { dueDate: 1, position: 1 };
    if (sort === 'priority') {
      sortOption = { priority: -1, position: 1 }; // high first
    }
    if (sort === 'created') sortOption = { createdAt: -1 };

    const tasks = await Task.find(filter).sort(sortOption);

    res.json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

// POST /api/boards/:boardId/tasks
export const createTask = async (req, res, next) => {
  try {
    const board = await verifyBoardOwnership(req.params.boardId, req.user.id);
    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found.' });
    }

    // Get max position for the target status column
    const maxPosTask = await Task.findOne({ board: board._id, status: req.body.status || 'todo' })
      .sort({ position: -1 });
    const position = maxPosTask ? maxPosTask.position + 1 : 0;

    const task = await Task.create({
      ...req.body,
      position,
      board: board._id,
      owner: req.user.id
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// GET /api/boards/:boardId/tasks/:id
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      board: req.params.boardId,
      owner: req.user.id
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// PUT /api/boards/:boardId/tasks/:id
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, board: req.params.boardId, owner: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/boards/:boardId/tasks/:id
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      board: req.params.boardId,
      owner: req.user.id
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({ success: true, message: 'Task deleted.' });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/boards/:boardId/tasks/:id/move
export const moveTask = async (req, res, next) => {
  try {
    const { status, position } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      board: req.params.boardId,
      owner: req.user.id
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const oldStatus = task.status;
    const oldPosition = task.position;

    // If moving within the same column
    if (oldStatus === status) {
      if (oldPosition < position) {
        // Moving down: shift items between old+1 and new up
        await Task.updateMany(
          { board: task.board, status, position: { $gt: oldPosition, $lte: position } },
          { $inc: { position: -1 } }
        );
      } else if (oldPosition > position) {
        // Moving up: shift items between new and old-1 down
        await Task.updateMany(
          { board: task.board, status, position: { $gte: position, $lt: oldPosition } },
          { $inc: { position: 1 } }
        );
      }
    } else {
      // Moving to a different column
      // Close the gap in the old column
      await Task.updateMany(
        { board: task.board, status: oldStatus, position: { $gt: oldPosition } },
        { $inc: { position: -1 } }
      );
      // Make room in the new column
      await Task.updateMany(
        { board: task.board, status, position: { $gte: position } },
        { $inc: { position: 1 } }
      );
    }

    task.status = status;
    task.position = position;
    await task.save();

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};
