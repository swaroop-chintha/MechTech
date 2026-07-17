const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

// Enable CORS for frontend requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse body only for non-proxied routes (if any).
// For proxy requests, express-http-proxy handles parsing and streaming.
app.use('/api', proxy(BACKEND_URL, {
  proxyReqPathResolver: function (req) {
    // Keep the path /api/auth/login etc. exactly as is
    return req.originalUrl;
  },
  userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
    // Add custom debug headers if needed
    headers['x-proxied-by'] = 'MechTech-Node-BFF';
    return headers;
  }
}));

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'MechTech-BFF-Gateway' });
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js BFF Gateway running on port ${PORT}`);
  console.log(`🔗 Proxying /api/* requests to Spring Boot at ${BACKEND_URL}`);
});
