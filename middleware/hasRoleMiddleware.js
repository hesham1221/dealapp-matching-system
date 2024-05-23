import { handleError } from "./errorHandler.js";
const hasRoleMiddleware = (role) => async (req, res, next) => {
  if (!req.user) {
    return handleError(res, 401, "Unauthorized");
  }
  if (req.user.role !== role) return handleError(res, 403, "Forbidden");
  next();
};

export default hasRoleMiddleware;
