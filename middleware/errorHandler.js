export const handleError = (res, statusCode, message) => {
  let msg = message;
  let code = statusCode;
  try {
    const jsonMsg = JSON.parse(message);
    msg = jsonMsg.message ? jsonMsg.message : jsonMsg;
    code = jsonMsg.status ? jsonMsg.status : code;
  } catch (error) {}
  res.status(code).json({ error: msg });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};

export default errorHandler;
