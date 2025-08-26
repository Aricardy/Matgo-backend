import express from 'express';
import { getRoutePrices, getBestRoutePrice } from '../controllers/routePriceController.js';

const router = express.Router();

// GET /route-prices?route_id=1&sacco_id=2&direction=TO_TOWN&road=NGONG_RD&time=10:00:00
router.get('/', getRoutePrices);

// GET /route-prices/best?route_id=1&sacco_id=2&direction=TO_TOWN&road=NGONG_RD&time=10:00:00
router.get('/best', getBestRoutePrice);

export default router;
