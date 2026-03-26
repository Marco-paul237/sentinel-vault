import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(morgan('dev'));

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api/', limiter);

// Proxy Routes
app.use('/api/auth', createProxyMiddleware({ target: 'http://localhost:4001', changeOrigin: true, pathRewrite: { '^/api/auth': '' } }));
app.use('/api/files', createProxyMiddleware({ target: 'http://localhost:4002', changeOrigin: true, pathRewrite: { '^/api/files': '' } }));
app.use('/api/encrypt', createProxyMiddleware({ target: 'http://localhost:4003', changeOrigin: true, pathRewrite: { '^/api/encrypt': '' } }));
app.use('/api/audit', createProxyMiddleware({ target: 'http://localhost:4004', changeOrigin: true, pathRewrite: { '^/api/audit': '' } }));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

app.listen(PORT, () => console.log(`🚀 API Gateway routing on port ${PORT}`));
