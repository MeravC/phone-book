const { metrics } = require('../metrics/prometheus');

const metricsMiddleware = (req, res, next) => {
  
  if (req.path === '/metrics') {
    return next();
  }

  const start = Date.now();

  // Record response metrics when the response finishes
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;

    // Record request duration
    metrics.httpRequestDuration.labels(
      req.method,
      route,
      res.statusCode
    ).observe(duration);

    // Track error rates
    if (res.statusCode >= 400) {
      metrics.errorRate.labels(
        req.method,
        route,
        res.statusCode
      ).inc();
    }
  });

  next();
};

module.exports = metricsMiddleware;