import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// A secure KMS (Key Management System) is mocked here
const getMasterKey = () => process.env.ENCRYPTION_KEY || crypto.randomBytes(32);

app.post('/encrypt', (req, res) => {
  try {
    const { data } = req.body; // Base64 encoded file chunk
    if (!data) return res.status(400).json({ error: 'No data provided' });

    const buffer = Buffer.from(data, 'base64');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', getMasterKey(), iv);
    
    const encryptedData = Buffer.concat([cipher.update(buffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    res.json({
      encryptedBase64: encryptedData.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64')
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Encryption failed' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'encryption-service' }));

app.listen(PORT, () => console.log(`🔐 Encryption Service running on port ${PORT}`));
