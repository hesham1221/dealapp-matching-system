import Joi from 'joi';

export const propertyRequestSchema = Joi.object({
  propertyType: Joi.string().valid('VILLA', 'HOUSE', 'LAND', 'APARTMENT').required(),
  area: Joi.number().required(),
  price: Joi.number().required(),
  city: Joi.string().required(),
  district: Joi.string().required(),
  description: Joi.string().optional(),
});

export const updatePropertyRequestSchema = Joi.object({
  description: Joi.string().optional(),
  area: Joi.number().optional(),
  price: Joi.number().optional(),
});
