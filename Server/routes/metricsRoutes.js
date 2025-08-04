// Server/routes/metricsRoutes.js
import express from 'express';
import { 
  getDashboardMetrics, 
  grafanaHealth, 
  grafanaSearch, 
  grafanaQuery,
  getDashboardSummary,
  getJsonApiData,
  getTestMetrics,
  getPrometheusMetrics,
  getSimpleMetrics
} from '../controllers/metricsController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// CORS headers for Grafana - MOVE THIS TO THE TOP
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Regular dashboard metrics
router.get('/dashboard', verifyToken, getDashboardMetrics);
router.get('/summary', verifyToken, getDashboardSummary);

// JSON API endpoints for Grafana
router.get('/json', getJsonApiData);
router.get('/test', getTestMetrics);
router.get('/prometheus', getPrometheusMetrics);
router.get('/simple', getSimpleMetrics);

// Grafana specific endpoints
router.get('/grafana', grafanaHealth);
router.post('/grafana/search', grafanaSearch);
router.post('/grafana/query', grafanaQuery);

export default router;