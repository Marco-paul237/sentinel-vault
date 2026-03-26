import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Redis from 'ioredis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4005;

const redisHost = process.env.REDIS_HOST || 'localhost';
const subscriber = new Redis(6379, redisHost);

app.use(cors());
app.use(express.json());

// Start listening to the event stream
subscriber.subscribe('sentinel-events', (err, count) => {
  if (err) {
    console.error('Failed to subscribe: %s', err.message);
  } else {
    console.log(`Subscribed successfully! Listening for events.`);
  }
});

subscriber.on('message', (channel, message) => {
  if (channel === 'sentinel-events') {
    const event = JSON.parse(message);
    analyzeEvent(event);
  }
});

const analyzeEvent = (event) => {
  console.log(`[ANALYZER] Processing event: ${event.eventType} for user ${event.userId}`);
  
  // Basic mock anomaly detection
  if (event.eventType === 'MASS_DOWNLOAD' || event.metadata?.riskScore > 80) {
    console.error(`🚨 ANOMALY DETECTED: High-risk action by User ${event.userId}! Firing alert.`);
    // Here we would push an alert to a WebSocket Server for the Frontend UI
  }
};

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'real-time-monitor' }));

app.listen(PORT, () => console.log(`👁️ Real-Time Monitor running on port ${PORT}`));
