import { getAISuggestion } from '../services/aiService.js';

// POST /api/ai/suggest
export const suggestEstimate = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required for AI suggestion.'
      });
    }

    const suggestion = await getAISuggestion(title, description || '');

    res.json({
      success: true,
      data: suggestion
    });
  } catch (error) {
    next(error);
  }
};
