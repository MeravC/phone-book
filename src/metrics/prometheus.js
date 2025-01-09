const client = require('prom-client');

// Create a Registry to store metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({
  register,
  prefix: 'phonebook_'
});

const metrics = {
    // 1. HTTP Request Duration
    httpRequestDuration: new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5]
    }),
  
    // 2. Error Rate
    errorRate: new client.Counter({
      name: 'http_request_errors_total',
      help: 'Total number of HTTP request errors',
      labelNames: ['method', 'route', 'status_code']
    }),
  
    // 3. Database Operation Duration
    databaseOperationDuration: new client.Histogram({
      name: 'database_operation_duration_seconds',
      help: 'Duration of database operations in seconds',
      labelNames: ['operation'],
      buckets: [0.1, 0.5, 1, 2, 5]
    })
  };
  

// Register metrics
Object.values(metrics).forEach(metric => register.registerMetric(metric));

module.exports = { register, metrics };