import Joi from 'joi';

export const createBoardSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required()
    .messages({ 'string.empty': 'Board title is required' }),
  description: Joi.string().trim().max(500).allow('').default('')
});

export const updateBoardSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100)
    .messages({ 'string.empty': 'Board title cannot be empty' }),
  description: Joi.string().trim().max(500).allow('')
}).min(1).messages({ 'object.min': 'At least one field must be provided' });
