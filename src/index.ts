import express from 'express';
import dotenv from 'dotenv';
import router from './routes';
import { setupSwagger } from './swagger/swaggerConfig';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api', router);

setupSwagger(app);

export default app;
