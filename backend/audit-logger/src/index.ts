import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4004;

const redisHost = process.env.REDIS_HOST || 'localhost';
const redis = new Redis(6379, redisHost);

app.use(cors());
app.use(express.json());

app.post('/log', async (req, res) => {
  try {
    const { eventType, userId, fileId, metadata } = req.body;
    
    const logEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      eventType,
      userId,
      fileId,
      metadata
    };

    // Store log locally or push to DB (omitted for brevity)
    
    // Publish to Real-Time Monitor stream
    await redis.publish('sentinel-events', JSON.stringify(logEntry));

    res.status(201).json({ status: 'logged', id: logEntry.id });
  } catch (err) {
    console.error('Logging Error:', err);
    res.status(500).json({ error: 'Failed to ingest log' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'audit-logger' }));

app.listen(PORT, () => console.log(`📋 Audit Logger running on port ${PORT}`));
