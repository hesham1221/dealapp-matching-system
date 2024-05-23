export const handleError = (res, statusCode, message) => {
  res.status(statusCode).json({ error: message });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

export default errorHandler;
