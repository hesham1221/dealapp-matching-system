import PropertyRequest from '../models/PropertyRequest.js';
import { handleError } from '../middleware/errorHandler.js';
import { validateRequest } from '../services/validation.js';
import { propertyRequestSchema, updatePropertyRequestSchema } from '../validators/propertyRequestValidators.js';

export const createPropertyRequest = async (req, res) => {
  try {
    const requestData = validateRequest(propertyRequestSchema, req.body);

    const propertyRequest = new PropertyRequest({
      ...requestData,
      user: req.user._id,
    });

    await propertyRequest.save();
    res.status(201).json(propertyRequest);
  } catch (error) {
    handleError(res, 400, error.message);
  }
};

export const updatePropertyRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const updateData = validateRequest(updatePropertyRequestSchema, req.body);

    const propertyRequest = await PropertyRequest.findByIdAndUpdate(
      id,
      { ...updateData, refreshedAt: Date.now() },
      { new: true }
    );

    if (!propertyRequest) {
      return handleError(res, 404, 'Property request not found');
    }

    res.json(propertyRequest);
  } catch (error) {
    handleError(res, 400, error.message);
  }
};
