# SENTINEL VAULT — Universal Intellectual Property Shield

Sentinel Vault is a high-security document repository and real-time monitoring console designed to protect intellectual property assets, track user operations, detect security anomalies, and manage corporate file compliance.

---

## 🚀 Key Features

* **Symmetric Cryptography at Rest:** All payloads are encrypted using AES-256-CBC, each containing isolated 16-byte random Initialization Vectors (IV).
* **Role-Based Access Control (RBAC):** Access privileges are isolated across Administrator, Executive, and Operator / Junior roles.
* **Database & Storage Portability:**
  * **Database:** Connects to a local SQLite database for quick development and AWS RDS PostgreSQL (using passwordless 15-minute expiring IAM tokens) for production.
  * **Storage:** Utilizes local filesystem storage for staging and streams directly to Amazon S3 in production.
* **Forensic Auditing & Logging:** Logs every operation (authentications, uploads, downloads, modifications, policy shifts) and performs real-time telemetry updates.
* **Threat Alert System:** Monitors events against active compliance rules (e.g. bulk downloads threshold) and triggers email notifications to administrators when critical anomalies are detected.
* **Personnel Inbound Portal:** Glowing, high-tech dark telemetry dashboard featuring glassmorphic panels and live activity telemetry.

---

## 🛠️ Tech Stack

* **Frontend:** React + Vite + Tailwind CSS / Custom CSS + Lucide Icons.
* **Backend:** Node.js + Express + TypeScript + JWT + Bcrypt + Multer + Nodemailer.
* **Databases:** SQLite + AWS RDS PostgreSQL.
* **Cloud Operations:** AWS ECS (Fargate) + Application Load Balancer + S3 + CloudFront CDN + CloudWatch Logs.

---

## 📖 Documentation Index

For detailed descriptions of the components, configurations, schemas, and design templates:

* **[Product Requirements Document (PRD.md)](file:///Users/ndepemarco/Desktop/Design%20project%202/PRD.md):** Functional Requirements matrix and persona definitions.
* **[System Architecture Guide (architecture.md)](file:///Users/ndepemarco/Desktop/Design%20project%202/architecture.md):** Cryptographic flows, network design, and AWS cloud topology.
* **[Design System Guidelines (design.md)](file:///Users/ndepemarco/Desktop/Design%20project%202/design.md):** Color schemes, typography, layout rules, and panel hierarchy.
* **[Database Schema Definitions (Schema.md)](file:///Users/ndepemarco/Desktop/Design%20project%202/Schema.md):** Entity Relation Diagrams, data types, and SQL DDL tables.
* **[Compliance & Security Policies (Rules.md)](file:///Users/ndepemarco/Desktop/Design%20project%202/Rules.md):** Threat scoring thresholds, RBAC matrix, and security rules.

---

## ⚙️ Local Development Quickstart

### 1. Set Up Environment Variables
Create a `.env` file inside the `backend/server` directory:

```env
PORT=4000
JWT_SECRET=super_secret_dev_key
# Optional AWS settings - if omitted, the app defaults to local SQLite and Disk storage.
# S3_BUCKET_NAME=my-sentinel-vault-bucket
# DB_HOST=rds-postgres-hostname.amazonaws.com
# DB_USER=postgres_user
# DB_NAME=sentinel
# AWS_REGION=us-east-1
```

### 2. Install Dependencies & Start the Apps
From the project root:

```bash
# Install frontend and backend root modules
npm install

# Start local services (Postgres, Redis, MinIO mock)
cd backend
docker-compose up -d
cd ..

# Run both the Frontend and Monolith Backend in development mode
npm run dev
```
The frontend is served at `http://localhost:5173` and backend runs on `http://localhost:4000`.

---

## 🐳 Docker and Cloud Deployments

To build and deploy the containerized backend to ECR/ECS Fargate:

```bash
# Log in to AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com

# Build the Docker image
docker build -t sentinel-backend:latest .

# Tag and push the image
docker tag sentinel-backend:latest <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/sentinel-backend:latest
docker push <aws_account_id>.dkr.ecr.us-east-1.amazonaws.com/sentinel-backend:latest

# Force new ECS deployment to pull the latest image
aws ecs update-service --cluster sentinel-vault-cluster1 --service sentinel-backend-service --force-new-deployment --region us-east-1
```
