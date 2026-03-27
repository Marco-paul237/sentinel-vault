import React from 'react';
import { Shield, Activity, Wifi, User, Clock, FileText, Zap, Globe, AlertCircle } from 'lucide-react';

const MonitoringWall = ({ auditLogs = [] }) => {
  const realLogs = auditLogs.slice(0, 50); // Show more logs in this dedicated view
  const highRiskLogs = realLogs.filter(log => log.risk_score > 50);

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-sentinel-teal/20 rounded-xl">
            <Activity className="text-sentinel-teal" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">TechForge SOC Dashboard</h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-xs text-text-secondary">Security Operations Center — Real-time Audit & IP Protection</p>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-safe-green/20 text-safe-green text-[10px] font-bold rounded-full border border-safe-green/30">
                <Wifi size={10} className="animate-pulse" /> SYSTEM LIVE
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex gap-6">
          <div className="text-right">
            <div className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">Total Events</div>
            <div className="text-2xl font-mono font-bold text-white">{auditLogs.length}</div>
          </div>
          <div className="w-px h-10 bg-glass-border"></div>
          <div className="text-right">
            <div className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mb-1">High Risk Alerts</div>
            <div className="text-2xl font-mono font-bold text-alert-red">{highRiskLogs.length}</div>
          </div>
        </div>
      </div>

      {/* Main SOC Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Security Stats */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-sentinel-teal flex items-center gap-2">
              <Shield size={16} /> Security Posture
            </h3>
            <div className="space-y-4">
              <StatItem label="Active Sessions" value="1" trend="STABLE" />
              <StatItem label="IP Protection" value="ENFORCED" trend="ACTIVE" color="text-safe-green" />
              <StatItem label="Encryption" value="AES-256" trend="GCM" />
              <StatItem label="MFA Enforcement" value="STRICT" color="text-safe-green" />
            </div>
          </div>

          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-alert-red flex items-center gap-2">
              <AlertCircle size={16} /> Critical Incidents
            </h3>
            <div className="space-y-3">
              {highRiskLogs.length > 0 ? highRiskLogs.slice(0, 3).map(log => (
                <div key={log.id} className="p-3 bg-alert-red/10 border border-alert-red/30 rounded-lg">
                  <div className="text-xs font-bold text-alert-red">{log.event_type}</div>
                  <div className="text-[10px] text-text-secondary mt-1 truncate">{log.user_email}</div>
                  <div className="text-[10px] text-text-secondary mt-1">{log.created_at ? new Date(log.created_at.replace(' ', 'T')).toLocaleTimeString() : '--:--:--'}</div>
                </div>
              )) : (
                <div className="text-center py-4 text-xs text-text-secondary bg-white/5 rounded-lg border border-glass-border">
                  No critical incidents detected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center/Right: Detailed Live Feed */}
        <div className="lg:col-span-3 glass-panel flex flex-col min-h-0 border-sentinel-teal/20">
          <div className="p-4 border-b border-glass-border flex items-center justify-between bg-white/5">
            <div className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="text-sentinel-teal" /> Global Access Stream
            </div>
            <div className="flex items-center gap-4 text-[10px] text-text-secondary">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-sentinel-teal"></div> UPLOAD/DOWNLOAD</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-alert-red"></div> SECURITY ALERT</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-bold text-text-secondary uppercase tracking-widest">
              <div className="col-span-2">Timestamp</div>
              <div className="col-span-2">User</div>
              <div className="col-span-3">Action</div>
              <div className="col-span-4">Asset / Details</div>
              <div className="col-span-1 text-right">Risk</div>
            </div>
            
            {realLogs.length > 0 ? realLogs.map((log) => (
              <div 
                key={log.id} 
                className={`grid grid-cols-12 items-center px-4 py-3 rounded-lg border transition-all hover:scale-[1.01] hover:bg-white/5 ${
                  log.risk_score > 50 ? 'bg-alert-red/10 border-alert-red/30' : 'bg-white/5 border-glass-border/50'
                }`}
              >
                <div className="col-span-2 text-xs font-mono opacity-70">
                  {log.created_at ? new Date(log.created_at.replace(' ', 'T')).toLocaleTimeString() : '--:--:--'}
                </div>
                <div className="col-span-2 text-xs truncate pr-4 font-medium" title={log.user_email}>
                  {log.user_email.split('@')[0]}
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <span className={`p-1 rounded ${
                    log.event_type.includes('DOWNLOAD') ? 'bg-sentinel-teal/20 text-sentinel-teal' : 
                    log.event_type.includes('UPLOAD') ? 'bg-safe-green/20 text-safe-green' : 
                    log.risk_score > 50 ? 'bg-alert-red/20 text-alert-red' : 'bg-white/10 text-white'
                  }`}>
                    {log.event_type.includes('DOWNLOAD') ? <Zap size={12} /> : 
                     log.event_type.includes('UPLOAD') ? <FileText size={12} /> : <User size={12} />}
                  </span>
                  <span className="text-xs font-bold whitespace-nowrap">{log.event_type.replace(/_/g, ' ')}</span>
                </div>
                <div className="col-span-4 text-xs truncate text-text-secondary italic pr-4">
                  {log.file_name || log.details || 'System event'}
                </div>
                <div className={`col-span-1 text-right text-xs font-bold ${
                  log.risk_score > 70 ? 'text-alert-red' : 
                  log.risk_score > 40 ? 'text-yellow-500' : 'text-safe-green'
                }`}>
                  {log.risk_score}
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-20">
                <Activity size={48} className="mb-4 text-sentinel-teal animate-pulse" />
                <h3 className="text-lg font-bold">No Security Events</h3>
                <p className="text-sm">Perform actions in the vault to see live audits.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 168, 150, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

const StatItem = ({ label, value, trend, color = "text-white" }) => (
  <div className="flex flex-col">
    <div className="flex justify-between items-end mb-1">
      <span className="text-[10px] text-text-secondary uppercase font-bold">{label}</span>
      {trend && <span className="text-[9px] font-black text-sentinel-teal/60">{trend}</span>}
    </div>
    <div className={`text-sm font-bold ${color}`}>{value}</div>
  </div>
);

export default MonitoringWall;
