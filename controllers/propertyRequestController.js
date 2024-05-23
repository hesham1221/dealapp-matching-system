import PropertyRequest from "../models/PropertyRequest.js";
import { handleError } from "../middleware/errorHandler.js";
import { validateRequest } from "../services/validation.js";
import {
  propertyRequestSchema,
  updatePropertyRequestSchema,
} from "../validators/propertyRequestValidators.js";
import { paginate } from "../services/pagination.js";
import { parseQueryParams } from "../services/paramParse.js";
import { getProperityRequestSchema } from "../validators/getProperityRequestValidator.js";

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
  try {
    const { query, page, limit } = parseQueryParams(
      req.query,
      {
        user: req.user._id,
        ...((req.query?.minPrice || req.query?.maxPrice) && {
          price: {
            ...(req.query?.minPrice && {
              $gte: parseInt(req.query?.minPrice, 10),
            }),
            ...(req.query?.maxPrice && { $lte: parseInt(req.query?.maxPrice) }),
          },
        }),
      },
      getProperityRequestSchema,
      true,
      false,
      ["minPrice", "maxPrice"]
    );
    const results = await paginate(PropertyRequest, query, page, limit, {
      refreshedAt: -1,
    });
    res.json(results);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};
export const getPropertyRequests = async (req, res) => {
  try {
    const { query, page, limit } = parseQueryParams(
      req.query,
      {
        ...((req.query?.minPrice || req.query?.maxPrice) && {
          price: {
            ...(req.query?.minPrice && {
              $gte: parseInt(req.query?.minPrice, 10),
            }),
            ...(req.query?.maxPrice && { $lte: parseInt(req.query?.maxPrice) }),
          },
        }),
      },
      getProperityRequestSchema,
      true,
      false,
      ["minPrice", "maxPrice"]
    );
    const results = await paginate(PropertyRequest, query, page, limit, {
      refreshedAt: -1,
    });
    res.json(results);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};
