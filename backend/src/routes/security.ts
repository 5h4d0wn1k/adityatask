import express from 'express';
import { authenticate, restrictTo } from '../middleware/auth';
import { getSecurityMetrics, runSecurityScan, getVulnerabilities } from '../controllers/security';

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Security routes
router.get('/metrics', getSecurityMetrics);
router.post('/scan', runSecurityScan);
router.get('/vulnerabilities', getVulnerabilities);

export default router; 