function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 400;
  if (statusCode >= 500) {
    console.error(err);
  }
  res.status(statusCode).json({ error: err.message || 'Unexpected error' });
}

module.exports = errorHandler;
