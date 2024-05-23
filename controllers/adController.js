import Ad from '../models/Ad.js';
import PropertyRequest from '../models/PropertyRequest.js';
import { handleError } from '../middleware/errorHandler.js';
import { validateRequest } from '../services/validation.js';
import { adSchema } from '../validators/adValidators.js';
import { paginate } from '../services/pagination.js';

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
      return handleError(res, 404, 'Ad not found');
    }

    const priceLowerBound = ad.price * 0.9;
    const priceUpperBound = ad.price * 1.1;

    const query = {
      district: ad.district,
      area: ad.area,
      price: { $gte: priceLowerBound, $lte: priceUpperBound },
    };

    const results = await paginate(PropertyRequest, query, page, limit, { refreshedAt: -1 });

    res.json(results);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};
