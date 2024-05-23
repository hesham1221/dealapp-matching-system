import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('ADMIN', 'CLIENT', 'AGENT').required(),
});

export const loginSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required(),
});
