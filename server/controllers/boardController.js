import Board from '../models/Board.js';
import Task from '../models/Task.js';

// GET /api/boards
export const getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({ owner: req.user.id })
      .sort({ createdAt: -1 });

    // Get task counts per board
    const boardsWithCounts = await Promise.all(
      boards.map(async (board) => {
        const taskCounts = await Task.aggregate([
          { $match: { board: board._id } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const counts = { todo: 0, 'in-progress': 0, done: 0, total: 0 };
        taskCounts.forEach(tc => {
          counts[tc._id] = tc.count;
          counts.total += tc.count;
        });

        return { ...board.toObject(), taskCounts: counts };
      })
    );

    res.json({ success: true, data: boardsWithCounts });
  } catch (error) {
    next(error);
  }
};

// GET /api/boards/:id
export const getBoard = async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.user.id });
    
    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found.'
      });
    }

    res.json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
};

// POST /api/boards
export const createBoard = async (req, res, next) => {
  try {
    const board = await Board.create({
      ...req.body,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      data: { ...board.toObject(), taskCounts: { todo: 0, 'in-progress': 0, done: 0, total: 0 } }
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/boards/:id
export const updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found.'
      });
    }

    res.json({ success: true, data: board });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/boards/:id
export const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Board not found.'
      });
    }

    // Cascade delete all tasks in this board
    await Task.deleteMany({ board: board._id });

    res.json({ success: true, message: 'Board and all its tasks deleted.' });
  } catch (error) {
    next(error);
  }
};
