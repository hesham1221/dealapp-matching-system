import Joi from 'joi';

export const adSchema = Joi.object({
  propertyType: Joi.string().valid('VILLA', 'HOUSE', 'LAND', 'APARTMENT').required(),
  area: Joi.number().required(),
  price: Joi.number().required(),
  city: Joi.string().required(),
  district: Joi.string().required(),
  description: Joi.string().optional(),
});
