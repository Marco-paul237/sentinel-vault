# Security Policies & Compliance Rules — SENTINEL VAULT

## 1. Role-Based Access Control (RBAC) Policies

The Sentinel Vault application enforces strict RBAC to limit access to features and endpoints based on user roles:

| Access Privilege | Operator / Junior | Executive | Administrator (Admin) |
| :--- | :---: | :---: | :---: |
| **View Dashboard** | ✅ | ✅ | ✅ |
| **Browse Folders & Files** | ✅ | ✅ | ✅ |
| **Create Folders** | ✅ | ❌ | ✅ |
| **Upload Files** | ✅ | ❌ | ✅ |
| **Download Files** | ✅ | ✅ | ✅ |
| **Update File Metadata / Tags** | ✅ | ❌ | ✅ |
| **Delete Files / Folders** | ❌ | ❌ | ✅ |
| **Configure Threat Policies** | ❌ | ❌ | ✅ |
| **Emergency Purge Vault** | ❌ | ❌ | ✅ |
| **Manage User Roles** | ❌ | ❌ | ✅ |

---

## 2. Real-Time Anomaly & Threat Detection Rules

The forensic log engine matches actions against the following predefined alert rules:

### 2.1 Anomaly Rule: Bulk Document Ingestion / Export
* **Condition:** A single user ID performs > 50 `FILE_DOWNLOADED` operations within a sliding window of 60 seconds.
* **Result:** 
  1. Trigger immediate alert logging with an anomaly risk score of `90`.
  2. Send email notification via SMTP transporter to all system administrators.
  3. Optionally temporarily revoke the user session token.

### 2.2 Anomaly Rule: Suspicious Geolocation (Impossible Travel)
* **Condition:** The same user credentials log in from two separate, geographically distant IP addresses within an impossible timeframe.
* **Result:** Trigger security audit event, flag the session, and notify security officers.

### 2.3 Anomaly Rule: Executive Account Infiltration (Failed Logins)
* **Condition:** > 5 consecutive `LOGIN_FAILED` attempts targeting administrative email addresses.
* **Result:** Automatically increase the risk score of subsequent actions from that IP address.

---

## 3. Data Lifecycle & Purging Guidelines

* **Metadata Integrity:** Deleting files/folders removes all associated database records to ensure clean audit reporting.
* **Binary Disposal:** Deletions perform physical, unrecoverable unlinking (`fs.unlinkSync` or S3 client `DeleteObjectCommand`) of the ciphertext payload.
* **Master Purge Protocol:** Admin users possess the ability to invoke `/api/files/purge`, executing an immediate complete deletion of all file objects and folder hierarchies within the vault.
