const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const isMulterError = err.name === "MulterError";
  const message = isMulterError ? `Upload error: ${err.message}` : err.message;

  res.status(statusCode).json({
    message: message || "Internal server error",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }),
  });
};

module.exports = {
  notFound,
  errorHandler,
};
