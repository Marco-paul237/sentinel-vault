# Product Requirements Document (PRD) — SENTINEL VAULT

## 1. Executive Summary
**SENTINEL VAULT** is a high-security, enterprise-grade Universal Intellectual Property Shield designed to protect proprietary intellectual assets, track all document interactions, and detect anomalies in real-time. By leveraging symmetric cryptography, strict role-based access control, and asynchronous forensic logging, it provides compliance-ready safeguarding of highly sensitive data.

---

## 2. Core Personas
* **Administrator (Admin):** Manages user roles, configures threat-detection policies, and possesses emergency master purge rights over the vault.
* **Executive (Auditor/Security Officer):** Accesses real-time monitoring streams, telemetry dashboards, security alerts, and full forensic logs.
* **Operator (Junior/Senior Developer/IP Creater):** Uploads assets, organizes files into folder structures, updates metadata/tags, and downloads files in accordance with their access permissions.

---

## 3. Product Features & Scope

### 3.1 Session & Access Management
* **Strict JWT Authentication:** Stateless JWT tokens are signed with a 24-hour expiration.
* **Automated Privilege Promotion:** Designated emails (e.g. `pollosama237@gmail.com`) are automatically promoted to Admin status on registration.
* **Auto-Seeding:** Admin users are automatically seeded in local and production DB setups to survive ephemeral node restarts.

### 3.2 Secure Payload Cryptography
* **Payload Encryption-at-Rest:** All files uploaded are encrypted symmetrically using AES-256-CBC.
* **Initialization Vector (IV) isolation:** Every file gets a unique, cryptographically secure 16-byte random IV saved in the metadata store.
* **Secure Streaming Decryption:** Files are decrypted dynamically on the fly during authorized downloads without ever saving the plaintext payload on the local filesystem.

### 3.3 Folder and Metadata Hierarchy
* **Nested Folders:** Support for logical directory structures to mimic a standard OS explorer.
* **Dynamic Tagging:** Ability to append custom JSON key-value tags and classification labels (e.g., *Confidential*, *Internal*, *Public*) to files.

### 3.4 Real-Time Forensic Audit Engine
* **Universal Action Capture:** Audit entries must log user ID, email, target file ID, original file name, IP address, severity risk score, timestamp, and details.
* **Anomalous Bulk Download Alerts:** Instant notification to security administrators (via Nodemailer email SMTP alerts) if more than 50 files are downloaded in under 60 seconds.

---

## 4. Functional Requirements (Essential Matrix)

| Req ID | Requirement Name | Operational Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-01** | **User Authentication** | Hash credentials using `bcrypt` (10 rounds) and issue signed JWTs for sessions. | High |
| **FR-02** | **AES-256 Encryption** | Automatically encrypt files at rest using AES-256-CBC with individual 16-byte IVs. | High |
| **FR-03** | **Unified Storage Routing** | Abstract interface to write to local disk during development and stream to S3 in production. | High |
| **FR-04** | **Passwordless Database** | Use AWS RDS IAM authentication tokens (15-min expiry) for secure connections. | High |
| **FR-05** | **Role-Based Access (RBAC)**| Restrict uploads, deletions, and policy management to verified `admin` roles. | High |
| **FR-06** | **Forensic Audit Logs** | Track all operations (upload, download, delete, failed logins) with metadata and IP tracking. | High |
| **FR-07** | **Active Threat Monitoring**| Evaluate operations against security rules (e.g., bulk download threshold) and flag anomalies. | High |

---

## 5. Non-Functional Requirements

### 5.1 Security & Compliance
* **SOC2 & GDPR Compliance:** Immutable log records, end-to-end payload encryption, and strict data lifecycle controls.
* **Least Privilege:** Default access is restricted to read-only; mutations require explicit role validation.

### 5.2 Scalability & Architecture
* **Staged Database Portability:** The backend abstracts database queries to run on SQLite locally and AWS RDS PostgreSQL in production without changes to business logic.
* **High Availability:** Fully Dockerized backend designed to be deployed on AWS Elastic Container Service (ECS) Fargate with an Application Load Balancer (ALB).
