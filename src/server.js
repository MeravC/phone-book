const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const { register } = require('./metrics/prometheus');
const metricsMiddleware = require('./middleware/metricsMiddleware');

const connectDB = require('./config/database');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(metricsMiddleware);

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Routes
app.use('/api/contacts', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
  });
  
  const PORT = process.env.PORT || 3000;
  
  // Connect to database and start server
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
  
  module.exports = app; // For testing purposes