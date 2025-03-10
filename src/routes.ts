import express from 'express';
import { podracersParticipants } from './controllers/list-fusion';
import { saveCustomData } from './controllers/save-custom-data';
import { listHistory } from './controllers/list-history';
import { rateLimitMiddleware } from './middlewares/rate-limit';

const router = express.Router();

router.get('/fusionados', rateLimitMiddleware(5, 1), podracersParticipants);
router.post('/almacenar', saveCustomData);
router.get('/historial', listHistory);

export default router;
