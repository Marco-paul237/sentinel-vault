import React, { useState, useEffect } from 'react'
import Layout from './components/Layout'
import ActivityCard from './components/ActivityCard'
import ExecutiveDashboard from './screens/ExecutiveDashboard'
import FileExplorer from './components/FileExplorer'
import FileAccessDetail from './screens/FileAccessDetail'
import MonitoringWall from './screens/MonitoringWall'
import PolicyManagement from './screens/PolicyManagement'
import LoginScreen from './screens/LoginScreen'

const API = 'http://localhost:4000/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFile, setSelectedFile] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  // Check for existing session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('sentinel_token');
    const savedUser = localStorage.getItem('sentinel_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch audit logs when authenticated
  useEffect(() => {
    if (!token) return;
    fetchAuditLogs();
    const interval = setInterval(fetchAuditLogs, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [token]);

  const fetchAuditLogs = async () => {
    try {
      // Use cache-busting to ensure we get the absolute latest logs
      const res = await fetch(`${API}/audit/logs?t=${Date.now()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const logs = await res.json();
        setAuditLogs(Array.isArray(logs) ? logs : []);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    }
  };

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('sentinel_token');
    localStorage.removeItem('sentinel_user');
    setUser(null);
    setToken(null);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setActiveTab('detail');
  };

  // If not logged in, show login screen
  if (!user || !token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Transform audit logs into activity format
  const activities = auditLogs.slice(0, 10).map(log => {
    try {
      const dateStr = log.created_at ? log.created_at.replace(' ', 'T') : new Date().toISOString();
      const date = new Date(dateStr);
      
      return {
        user: log.user_email || 'SYSTEM',
        action: (log.event_type || 'Unknown').replace(/_/g, ' '),
        fileName: log.file_name || log.details || 'System Event',
        time: isNaN(date.getTime()) ? 'Recently' : (date.toLocaleTimeString() + ' ' + date.toLocaleDateString()),
        location: log.ip_address || 'localhost',
        riskScore: log.risk_score || 0,
        riskLevel: log.risk_score > 50 ? 'high' : log.risk_score > 20 ? 'medium' : 'low'
      };
    } catch (e) {
      return null;
    }
  }).filter(Boolean);

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'explorer':
        return <FileExplorer onFileSelect={handleFileSelect} token={token} onUpload={fetchAuditLogs} />;
      case 'policy':
        return <PolicyManagement token={token} />;
      case 'detail':
        return selectedFile ? (
          <FileAccessDetail file={selectedFile} onBack={() => setActiveTab('explorer')} token={token} onAction={fetchAuditLogs} />
        ) : (
          <FileExplorer onFileSelect={handleFileSelect} token={token} onUpload={fetchAuditLogs} />
        );
      case 'activity':
        return <MonitoringWall auditLogs={auditLogs} />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={(tab) => {
      setActiveTab(tab);
      if (tab !== 'detail') setSelectedFile(null);
    }} user={user} onLogout={handleLogout}>
      <div className="space-y-8 h-full">
        {renderContent()}
        
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Live Activity — TechForge Solutions</h3>
              <button 
                onClick={() => setActiveTab('activity')}
                className="text-sm text-sentinel-teal hover:underline font-medium"
              >
                View SOC Dashboard
              </button>
            </div>
            <div className="grid gap-3">
              {activities.length > 0 ? activities.map((activity, idx) => (
                <ActivityCard key={idx} activity={activity} />
              )) : (
                <div className="glass-panel p-6 text-center text-text-secondary text-sm">
                  No activity yet. Upload a file or perform an action to see live audit logs here.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default App
