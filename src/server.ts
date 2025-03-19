import app from './index';
import serverless from 'serverless-http';

const PORT = process.env.PORT || 3000;

// Express => Lambda
export const handler = serverless(app);
