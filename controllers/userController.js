import User from "../models/User.js";
import { handleError } from "../middleware/errorHandler.js";
import { paginate } from "../services/pagination.js";

export const getAdminStats = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const aggregationPipeline = [
      {
        $lookup: {
          from: "propertyrequests",
          localField: "_id",
          foreignField: "user",
          as: "requests",
        },
      },
      {
        $lookup: {
          from: "ads",
          localField: "_id",
          foreignField: "user",
          as: "ads",
        },
      },
      {
        $project: {
          name: 1,
          phone: 1,
          role: 1,
          status: 1,
          adsCount: { $size: "$ads" },
          totalAdsAmount: { $sum: "$ads.price" },
          requestsCount: { $size: "$requests" },
          totalRequestsAmount: { $sum: "$requests.price" },
        },
      },
    ];

    const users = await paginate(
      User.aggregate(aggregationPipeline),
      {},
      page,
      limit
    );

    res.json(users);
  } catch (error) {
    handleError(res, 500, error.message);
  }
};
