import Joi from "joi";

export const getAdSchema = Joi.object({
  propertyType: Joi.string()
    .valid("VILLA", "HOUSE", "LAND", "APARTMENT")
    .optional(),
  area: Joi.number().optional(),
  minPrice: Joi.number().optional(),
  maxPrice: Joi.number().optional(),
  city: Joi.string().optional(),
  district: Joi.string().optional(),
});
