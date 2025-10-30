import express from 'express';
import {
  getDistrictReport,
  getAvailableDistricts,
  manualSync,
} from '../controllers/dataController.js';

const router = express.Router();

 
router.get('/districts/:stateName', getAvailableDistricts);


router.get('/report/:stateName/:districtName', getDistrictReport);


router.post('/sync', manualSync);

export default router;
