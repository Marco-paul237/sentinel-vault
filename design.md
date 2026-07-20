# Design System & UI/UX Guidelines — SENTINEL VAULT

## 1. Design Philosophy: Cyber-Ops Telemetry UI
Sentinel Vault features a premium, state-of-the-art **cyber-ops telemetry console**. The user experience is designed to look and feel like an advanced monitoring terminal, featuring glowing neon elements, high-tech metrics, glassmorphic panels, and real-time animation feedback.

---

## 2. Visual Identity & Tokens

### 2.1 Color Palette
The colors are selected to match high-security monitoring systems:

* **Primary Background:** `#0f172a` (Slate-900 / Deep space dark)
* **Secondary Background:** `#1e293b` (Slate-800 / Elevated cards)
* **Brand Accent / Teal:** `#00a896` / `#028090` (Teal Glow / Active systems)
* **High-Risk Crimson:** `#ef4444` (Threat anomaly detected)
* **System Health Green:** `#10b981` (System Integrity OK / Online)
* **Borders / Details:** `#1e293b` to `#334155` (Subtle divider rules)
* **Typography Base:** `#e2e8f0` (High contrast text)
* **Typography Muted:** `#94a3b8` (Telemetry metadata labels)

### 2.2 Typography
* **Base Text:** Sans-serif (Inter, system-ui) for clear scanning of complex metrics.
* **Telemetry & Logs:** Monospaced font families (Fira Code, JetBrains Mono, SFMono-Regular) to mimic CLI logs and highlight data elements.

### 2.3 UI Visual Enhancements
* **Backdrop Filters (Glassmorphism):** Blur effects (`backdrop-filter: blur(12px)`) on panels to create a multi-dimensional layering effect over dark space background grids.
* **Glow Accents:** Soft shadows using the primary teal accent (`box-shadow: 0 0 15px rgba(0, 168, 150, 0.25)`).

---

## 3. UI Component Structure

```
+---------------------------------------------------------------------------------+
|  🛡️  SENTINEL VAULT       [Search files/folders...]           (Logout) UserInfo  |
+---------------------------------------------------------------------------------+
|  (Nav Sidebar)  |  (Main Working Area)                                          |
|  - Dashboard    |  +---------------------------------------------------------+  |
|  - Files        |  |                      TELEMETRY PANEL                    |  |
|  - Monitor      |  | Total Assets: 284 | Risk: Low | Active Scans: 100%      |  |
|  - Policies     |  +---------------------------------------------------------+  |
|  - Users        |  |  [File Explorer / Log stream depending on selected Tab] |  |
|  - Settings     |  |                                                         |  |
|                 |  |                                                         |  |
|                 |  +---------------------------------------------------------+  |
+---------------------------------------------------------------------------------+
```

### 3.1 Login Screen (Personnel Inbound Portal)
* Dark cyber-terminal design requiring registration or credential entry.
* Form states provide high-contrast alerts (e.g. glowing red box on "Invalid Credentials").

### 3.2 Main Navigation Layout
* Left-docked navigation bar with intuitive icons.
* Collapsible sidebar panel for responsive mobile viewports.

### 3.3 Telemetry Cards (Dashboard)
* Live counters showing total protected intellectual property assets.
* Threat meter gauge highlighting current aggregate risk score.
* Integrity scanner displaying system status.

### 3.4 File Explorer
* Interactive folder trees that expand and collapse dynamically.
* File table showing size, original name, custom tags, and security classifications (e.g., *Confidential*, *Secret*, *Internal*).

### 3.5 Monitoring Wall
* Auto-scrolling logs showing real-time security logs.
* Color-coded tags indicating event types and risk severity (Low, Medium, Critical).
* Interactive detail modal showing expanded forensic headers (Source IP, User-Agent, JWT verification signature).
