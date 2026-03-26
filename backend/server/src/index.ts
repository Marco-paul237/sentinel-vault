import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'sentinel_vault_secret_2024';
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
const DB_PATH = path.join(__dirname, '..', 'sentinel.db');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.scryptSync('sentinel-master-key', 'salt', 32);

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ==================== DATABASE SETUP ====================
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS folders (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES folders(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    original_name TEXT NOT NULL,
    stored_name TEXT NOT NULL,
    classification TEXT DEFAULT 'Internal',
    size INTEGER,
    mime_type TEXT,
    uploaded_by TEXT,
    folder_id TEXT,
    iv TEXT,
    auth_tag TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    FOREIGN KEY (folder_id) REFERENCES folders(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    user_id TEXT,
    user_email TEXT,
    file_id TEXT,
    file_name TEXT,
    ip_address TEXT,
    details TEXT,
    risk_score INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS policies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    condition_field TEXT,
    condition_operator TEXT,
    condition_value TEXT,
    action TEXT,
    severity TEXT DEFAULT 'medium',
    enabled INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migrate: add folder_id column to files if it doesn't exist
try { db.exec('ALTER TABLE files ADD COLUMN folder_id TEXT'); } catch(e) { /* already exists */ }

console.log('✅ SQLite database initialized');

// Seed initial folders
const seedFolders = () => {
  const count = (db.prepare('SELECT COUNT(*) as count FROM folders').get() as any).count;
  if (count === 0) {
    console.log('🌱 Seeding initial folders...');
    const folders = [
      { id: 'f1', name: 'AI Research', parent_id: null },
      { id: 'f2', name: 'AI Algorithm', parent_id: 'f1' },
      { id: 'f3', name: 'Training Data', parent_id: 'f1' },
      { id: 'f4', name: 'Engineering', parent_id: null },
      { id: 'f5', name: 'Business Ops', parent_id: null },
      { id: 'f6', name: 'Legal & Patents', parent_id: null }
    ];
    const insert = db.prepare('INSERT INTO folders (id, name, parent_id) VALUES (?, ?, ?)');
    folders.forEach(f => insert.run(f.id, f.name, f.parent_id));
  }
};
seedFolders();

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// Email transporter (configured but won't send without App Password)
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'pollosama237@gmail.com',
    pass: process.env.EMAIL_PASS || 'NOT_CONFIGURED'
  }
});

// JWT Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Audit helper
const logAudit = async (eventType: string, userId: string | null, userEmail: string | null, fileId: string | null, fileName: string | null, ip: string, details: string, riskScore: number) => {
  const id = uuidv4();
  db.prepare(`INSERT INTO audit_logs (id, event_type, user_id, user_email, file_id, file_name, ip_address, details, risk_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(id, eventType, userId, userEmail, fileId, fileName, ip, details, riskScore);

  // Try to send email notification
  try {
    if (process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'NOT_CONFIGURED') {
      await emailTransporter.sendMail({
        from: `"SENTINEL Vault" <${process.env.EMAIL_USER}>`,
        to: 'pollosama237@gmail.com',
        subject: `[SENTINEL AUDIT] ${eventType} — Risk: ${riskScore}`,
        html: `
          <div style="font-family: monospace; background: #0f172a; color: #e2e8f0; padding: 24px; border-radius: 12px;">
            <h2 style="color: #00a896;">🔒 SENTINEL Vault — Audit Log</h2>
            <table style="width:100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; color: #94a3b8;">Event</td><td style="padding: 8px; font-weight: bold;">${eventType}</td></tr>
              <tr><td style="padding: 8px; color: #94a3b8;">User</td><td style="padding: 8px;">${userEmail || 'SYSTEM'}</td></tr>
              <tr><td style="padding: 8px; color: #94a3b8;">File</td><td style="padding: 8px;">${fileName || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; color: #94a3b8;">IP Address</td><td style="padding: 8px;">${ip}</td></tr>
              <tr><td style="padding: 8px; color: #94a3b8;">Risk Score</td><td style="padding: 8px; color: ${riskScore > 50 ? '#ef4444' : '#22c55e'}; font-weight: bold;">${riskScore}/100</td></tr>
              <tr><td style="padding: 8px; color: #94a3b8;">Details</td><td style="padding: 8px;">${details}</td></tr>
              <tr><td style="padding: 8px; color: #94a3b8;">Timestamp</td><td style="padding: 8px;">${new Date().toISOString()}</td></tr>
            </table>
          </div>
        `
      });
      console.log(`📧 Audit email sent for: ${eventType}`);
    }
  } catch (err) {
    console.log(`📧 Email not sent (configure EMAIL_PASS): ${eventType}`);
  }
};

// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const id = uuidv4();
    const passwordHash = bcrypt.hashSync(password, 10);
    db.prepare('INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)').run(id, email, passwordHash, role || 'user');

    const token = jwt.sign({ id, email, role: role || 'user' }, JWT_SECRET, { expiresIn: '24h' });

    await logAudit('USER_REGISTERED', id, email, null, null, req.ip || 'unknown', `New user registered: ${email}`, 5);

    res.status(201).json({ token, user: { id, email, role: role || 'user' } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      await logAudit('LOGIN_FAILED', null, email, null, null, req.ip || 'unknown', `Failed login attempt for: ${email}`, 65);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    await logAudit('USER_LOGIN', user.id, email, null, null, req.ip || 'unknown', `User logged in: ${email}`, 5);

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/verify', authenticate, (req: any, res) => {
  res.json({ valid: true, user: req.user });
});

// ==================== FILE ROUTES ====================
app.post('/api/files/upload', authenticate, upload.single('file'), async (req: any, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const id = uuidv4();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(req.file.buffer), cipher.final()]);

    const storedName = `${id}.enc`;
    fs.writeFileSync(path.join(UPLOAD_DIR, storedName), encrypted);

    const classification = req.body.classification || 'Internal';

    db.prepare('INSERT INTO files (id, original_name, stored_name, classification, size, mime_type, uploaded_by, folder_id, iv) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
      id, req.file.originalname, storedName, classification, req.file.size, req.file.mimetype, req.user.id, req.body.folder_id || null, iv.toString('hex')
    );

    await logAudit('FILE_UPLOADED', req.user.id, req.user.email, id, req.file.originalname, req.ip || 'unknown', `File uploaded: ${req.file.originalname} (${classification})`, 10);

    res.status(201).json({ id, name: req.file.originalname, classification, size: req.file.size });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/files/list', authenticate, (req: any, res) => {
  const folderId = req.query.folder_id || null;
  let files;
  if (folderId) {
    files = db.prepare('SELECT f.*, u.email as uploader_email FROM files f LEFT JOIN users u ON f.uploaded_by = u.id WHERE f.folder_id = ? ORDER BY f.created_at DESC').all(folderId);
  } else {
    files = db.prepare('SELECT f.*, u.email as uploader_email FROM files f LEFT JOIN users u ON f.uploaded_by = u.id ORDER BY f.created_at DESC').all();
  }
  res.json(files);
});

app.get('/api/files/download/:id', authenticate, async (req: any, res) => {
  try {
    const file: any = db.prepare('SELECT * FROM files WHERE id = ?').get(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    const filePath = path.join(UPLOAD_DIR, file.stored_name);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File data not found on disk' });

    const encryptedData = fs.readFileSync(filePath);
    const iv = Buffer.from(file.iv, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

    await logAudit('FILE_DOWNLOADED', req.user.id, req.user.email, file.id, file.original_name, req.ip || 'unknown', `File downloaded: ${file.original_name}`, 15);

    res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
    res.setHeader('Content-Type', file.mime_type || 'application/octet-stream');
    res.send(decrypted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/files/:id', authenticate, async (req: any, res) => {
  try {
    const file: any = db.prepare('SELECT * FROM files WHERE id = ?').get(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    const filePath = path.join(UPLOAD_DIR, file.stored_name);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    db.prepare('DELETE FROM files WHERE id = ?').run(req.params.id);

    await logAudit('FILE_DELETED', req.user.id, req.user.email, file.id, file.original_name, req.ip || 'unknown', `File deleted: ${file.original_name}`, 30);

    res.json({ message: 'File deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== AUDIT ROUTES ====================
app.get('/api/audit/logs', authenticate, (req: any, res) => {
  const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
  res.json(logs);
});

// ==================== FOLDER ROUTES ====================
app.get('/api/folders', authenticate, (req: any, res) => {
  const folders = db.prepare('SELECT * FROM folders ORDER BY name ASC').all();
  res.json(folders);
});

app.post('/api/folders', authenticate, async (req: any, res) => {
  try {
    const { name, parent_id } = req.body;
    if (!name) return res.status(400).json({ error: 'Folder name required' });

    const id = uuidv4();
    db.prepare('INSERT INTO folders (id, name, parent_id, created_by) VALUES (?, ?, ?, ?)').run(id, name, parent_id || null, req.user.id);

    await logAudit('FOLDER_CREATED', req.user.id, req.user.email, null, null, req.ip || 'unknown', `Folder created: ${name}`, 5);

    res.status(201).json({ id, name, parent_id: parent_id || null });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/folders/:id', authenticate, async (req: any, res) => {
  try {
    const folder: any = db.prepare('SELECT * FROM folders WHERE id = ?').get(req.params.id);
    if (!folder) return res.status(404).json({ error: 'Folder not found' });

    // Move files in this folder to root
    db.prepare('UPDATE files SET folder_id = NULL WHERE folder_id = ?').run(req.params.id);
    // Delete child folders
    db.prepare('DELETE FROM folders WHERE parent_id = ?').run(req.params.id);
    // Delete the folder
    db.prepare('DELETE FROM folders WHERE id = ?').run(req.params.id);

    await logAudit('FOLDER_DELETED', req.user.id, req.user.email, null, null, req.ip || 'unknown', `Folder deleted: ${folder.name}`, 15);

    res.json({ message: 'Folder deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== POLICY ROUTES ====================
app.get('/api/policies', authenticate, (req: any, res) => {
  const policies = db.prepare('SELECT * FROM policies ORDER BY created_at DESC').all();
  res.json(policies);
});

app.post('/api/policies', authenticate, async (req: any, res) => {
  try {
    const { name, description, condition_field, condition_operator, condition_value, action, severity } = req.body;
    if (!name) return res.status(400).json({ error: 'Policy name required' });

    const id = uuidv4();
    db.prepare('INSERT INTO policies (id, name, description, condition_field, condition_operator, condition_value, action, severity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
      id, name, description || '', condition_field || '', condition_operator || '', condition_value || '', action || '', severity || 'medium'
    );

    await logAudit('POLICY_CREATED', req.user.id, req.user.email, null, null, req.ip || 'unknown', `Policy created: ${name}`, 10);

    res.status(201).json({ id, name, description, severity });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/policies/:id', authenticate, async (req: any, res) => {
  try {
    const policy: any = db.prepare('SELECT * FROM policies WHERE id = ?').get(req.params.id);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });

    db.prepare('DELETE FROM policies WHERE id = ?').run(req.params.id);

    await logAudit('POLICY_DELETED', req.user.id, req.user.email, null, null, req.ip || 'unknown', `Policy deleted: ${policy.name}`, 20);

    res.json({ message: 'Policy deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  const userCount = (db.prepare('SELECT COUNT(*) as count FROM users').get() as any).count;
  const fileCount = (db.prepare('SELECT COUNT(*) as count FROM files').get() as any).count;
  const logCount = (db.prepare('SELECT COUNT(*) as count FROM audit_logs').get() as any).count;
  res.json({ status: 'ok', service: 'sentinel-vault-server', users: userCount, files: fileCount, auditLogs: logCount });
});

// ==================== START ====================
app.listen(PORT, () => {
  console.log(`\n🚀 SENTINEL Vault Server running on http://localhost:${PORT}`);
  console.log(`📦 Database: ${DB_PATH}`);
  console.log(`📁 Uploads: ${UPLOAD_DIR}`);
  console.log(`📧 Email: ${process.env.EMAIL_PASS ? 'Configured' : 'Not configured (set EMAIL_PASS)'}\n`);
});
