import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { handleError } from "./errorHandler.js";

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return handleError(res, 401, "No token, authorization denied");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    handleError(res, 401, "Token is not valid");
  }
};

export default authMiddleware;
