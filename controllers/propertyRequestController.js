import PropertyRequest from "../models/PropertyRequest.js";
import { handleError } from "../middleware/errorHandler.js";
import { validateRequest } from "../services/validation.js";
import {
  propertyRequestSchema,
  updatePropertyRequestSchema,
} from "../validators/propertyRequestValidators.js";
import { paginate } from "../services/pagination.js";

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

    // Fetch the PropertyRequest by ID
    const propertyRequest = await PropertyRequest.findById(id);

    // Check if the PropertyRequest exists
    if (!propertyRequest) {
      return handleError(res, 404, "Property request not found");
    }

    // Check if the PropertyRequest belongs to the authorized user
    if (propertyRequest.user.toString() !== req.user._id.toString()) {
      return handleError(
        res,
        403,
        "You are not authorized to update this property request"
      );
    }

    // Update the PropertyRequest
    const updatedPropertyRequest = await PropertyRequest.findByIdAndUpdate(
      id,
      { ...updateData, refreshedAt: Date.now() },
      { new: true }
    );

    res.json(updatedPropertyRequest);
  } catch (error) {
    handleError(res, 400, error.message);
  }
};

export const getUserPropertyRequests = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const query = { user: req.user._id };
    const results = await paginate(PropertyRequest, query, page, limit, {
      refreshedAt: -1,
    });
    res.json(results);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};
