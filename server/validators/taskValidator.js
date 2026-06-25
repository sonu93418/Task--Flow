import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required()
    .messages({ 'string.empty': 'Task title is required' }),
  description: Joi.string().trim().max(2000).allow('').default(''),
  status: Joi.string().valid('todo', 'in-progress', 'done').default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  dueDate: Joi.date().allow(null).default(null),
  estimatedEffort: Joi.string().trim().allow('').default('')
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().max(2000).allow(''),
  status: Joi.string().valid('todo', 'in-progress', 'done'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  dueDate: Joi.date().allow(null),
  estimatedEffort: Joi.string().trim().allow(''),
  position: Joi.number().integer().min(0)
}).min(1).messages({ 'object.min': 'At least one field must be provided' });

export const moveTaskSchema = Joi.object({
  status: Joi.string().valid('todo', 'in-progress', 'done').required(),
  position: Joi.number().integer().min(0).required()
});
