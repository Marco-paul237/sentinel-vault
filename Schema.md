# Database Schema & Data Models — SENTINEL VAULT

Sentinel Vault uses a unified database adapter layer supporting local SQLite databases and PostgreSQL (such as AWS RDS) for production deployments.

---

## 1. Entity Relationship Diagram (ERD)

The database schema manages user accounts, hierarchical folder organizational structures, files with cryptographic metadata, forensic audit logs, and compliance policies.

```mermaid
erDiagram
    USERS {
        text id PK
        text email UNIQUE
        text password_hash
        text role
        datetime created_at
    }
    FOLDERS {
        text id PK
        text name
        text parent_id FK
        text created_by FK
        datetime created_at
    }
    FILES {
        text id PK
        text original_name
        text stored_name
        text classification
        integer size
        text mime_type
        text uploaded_by FK
        text folder_id FK
        text tags
        text iv
        text auth_tag
        datetime created_at
    }
    AUDIT_LOGS {
        text id PK
        text event_type
        text user_id
        text user_email
        text file_id
        text file_name
        text ip_address
        text details
        integer risk_score
        datetime created_at
    }
    POLICIES {
        text id PK
        text name
        text description
        text condition_field
        text condition_operator
        text condition_value
        text action
        text severity
        integer enabled
        datetime created_at
    }

    USERS ||--o{ FOLDERS : "creates"
    USERS ||--o{ FILES : "uploads"
    FOLDERS ||--o{ FILES : "contains"
    FOLDERS ||--o{ FOLDERS : "parent of"
```

---

## 2. Table Specifications & DDL

### 2.1 Users Table (`users`)
Stores hashed authentication credentials, emails, and permissions roles.

```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'junior',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Folders Table (`folders`)
Enables nested logical folders.

```sql
CREATE TABLE IF NOT EXISTS folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id TEXT,
  created_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES folders(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### 2.3 Files Table (`files`)
Maintains metadata and the cryptographic variables needed to decrypt files.

```sql
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  original_name TEXT NOT NULL,
  stored_name TEXT NOT NULL,
  classification TEXT DEFAULT 'Internal',
  size INTEGER,
  mime_type TEXT,
  uploaded_by TEXT,
  folder_id TEXT,
  tags TEXT DEFAULT '[]', -- JSON String containing custom tag metadata
  iv TEXT,                -- Hexadecimal Initialization Vector (IV)
  auth_tag TEXT,          -- GCM authentication tag (if GCM mode is used)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id),
  FOREIGN KEY (folder_id) REFERENCES folders(id)
);
```

### 2.4 Audit Logs Table (`audit_logs`)
Tracks all actions in the system to enable search, dashboard metrics, and alerts.

```sql
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
```

### 2.5 Policies Table (`policies`)
Holds threat monitoring and alert configurations.

```sql
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
```
