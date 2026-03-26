import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import * as Minio from 'minio';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

// Minio Client Setup
const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'minio_admin',
  secretKey: 'secure_minio_password'
});

const upload = multer({ storage: multer.memoryStorage() }); // In-memory for direct stream transfer

// Setup bucket on start
const startMinio = async () => {
    try {
        const exists = await minioClient.bucketExists('sentinel-vault');
        if (!exists) {
            await minioClient.makeBucket('sentinel-vault', 'us-east-1');
            console.log('Bucket "sentinel-vault" created successfully.');
        }
    } catch(err) {
        console.error('MinIO Setup Error:', err);
    }
}
startMinio();

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const filename = `${Date.now()}-${req.file.originalname}`;
    
    // In a real flow, this buffer would be sent to the Encryption-Service,
    // and the resulting encrypted buffer would be sent to MinIO.
    // Flow: Client -> API Gateway -> File Service -> Encryption Service -> MinIO
    
    await minioClient.putObject('sentinel-vault', filename, req.file.buffer, req.file.size);
    
    res.json({ message: 'File uploaded securely', filename, size: req.file.size });
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'file-service' }));

app.listen(PORT, () => console.log(`📁 File Service running on port ${PORT}`));
