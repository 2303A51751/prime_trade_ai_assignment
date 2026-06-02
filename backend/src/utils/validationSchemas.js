const Joi = require('joi');

const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().min(6).required(),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createTask: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(2000).optional(),
    status: Joi.string().valid('pending', 'in-progress', 'completed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
    dueDate: Joi.date().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),

  updateTask: Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    description: Joi.string().max(2000).optional(),
    status: Joi.string().valid('pending', 'in-progress', 'completed', 'cancelled').optional(),
    priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
    dueDate: Joi.date().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }),
};

module.exports = schemas;
