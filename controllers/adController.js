import Ad from "../models/Ad.js";
import PropertyRequest from "../models/PropertyRequest.js";
import { handleError } from "../middleware/errorHandler.js";
import { validateRequest } from "../services/validation.js";
import { adSchema } from "../validators/adValidators.js";
import { paginate } from "../services/pagination.js";
import { parseQueryParams } from "../services/paramParse.js";
import { getAdSchema } from "../validators/getAdValidators.js";

export const createAd = async (req, res) => {
  try {
    const adData = validateRequest(adSchema, req.body);

    const ad = new Ad({
      ...adData,
      user: req.user._id,
    });

    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    handleError(res, 400, error.message);
  }
};

export const matchRequests = async (req, res) => {
  const { adId, page, limit } = req.query;

  try {
    const ad = await Ad.findById(adId);
    if (!ad) {
      return handleError(res, 404, "Ad not found");
    }

    const priceLowerBound = ad.price * 0.9;
    const priceUpperBound = ad.price * 1.1;

    const query = {
      district: ad.district,
      area: ad.area,
      price: { $gte: priceLowerBound, $lte: priceUpperBound },
    };
    const results = await paginate(PropertyRequest, query, page, limit, {
      refreshedAt: -1,
    });

    res.json(results);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

export const getUserAds = async (req, res) => {
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
      getAdSchema,
      true,
      false,
      ["minPrice", "maxPrice"]
    );
    const results = await paginate(Ad, query, page, limit, { createdAt: -1 });
    res.json(results);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};

export const getAds = async (req, res) => {
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
    getAdSchema,
    true,
    false,
    ["minPrice", "maxPrice"]
  );
  try {
    const results = await paginate(Ad, query, page, limit, {
      createdAt: -1,
    });
    res.json(results);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};
