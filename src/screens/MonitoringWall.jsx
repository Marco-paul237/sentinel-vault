import React from 'react';
import { Shield, AlertTriangle, Activity, Wifi, User, Clock, Lock, FileText, MapPin, Zap } from 'lucide-react';

const MonitoringWall = ({ auditLogs = [] }) => {
  const realLogs = auditLogs.slice(0, 15);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-3">
            <Activity className="text-sentinel-teal" size={24} />
            TechForge SOC — Security Operations Center
          </h2>
          <p className="text-xs text-text-secondary mt-1">Real-time threat detection & IP protection enforcement</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 bg-safe-green/20 text-safe-green text-[10px] font-bold rounded-full flex items-center gap-1">
            <Wifi size={10} /> LIVE
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Normal Day: Amara's Activity */}
        <div className="glass-panel p-5 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest text-safe-green mb-4 flex items-center gap-2">
            <Shield size={14} /> Normal Day — Amara Okafor
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {[
              { time: '9:00 AM', action: 'MFA Login (Authenticator App)', icon: <Lock size={12} />, detail: 'Lagos Office • Verified Device' },
              { time: '9:02 AM', action: 'JWT Token Issued', icon: <Shield size={12} />, detail: 'Role: Senior Developer • Scope: AI Research' },
              { time: '9:14 AM', action: 'Opened ai_core_algorithm_v3.py', icon: <FileText size={12} />, detail: 'Read Access • AES-256 Decrypted In-Memory' },
              { time: '9:38 AM', action: 'Opened training_pipeline_config.yaml', icon: <FileText size={12} />, detail: 'Read Access • Watermark Applied' },
              { time: '9:42 AM', action: 'Edited & Saved config.yaml', icon: <FileText size={12} />, detail: 'Write Access • Version 14 Created' },
              { time: '12:30 PM', action: 'Session Idle — Auto-Locked', icon: <Lock size={12} />, detail: 'Automatic Security Timeout' },
            ].map((event, i) => (
              <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-lg border border-glass-border/50">
                <div className="p-1.5 bg-safe-green/10 rounded text-safe-green mt-0.5">{event.icon}</div>
                <div>
                  <div className="text-xs font-bold">{event.action}</div>
                  <div className="text-[10px] text-text-secondary mt-0.5">{event.detail}</div>
                  <div className="text-[10px] text-text-secondary flex items-center gap-1 mt-1"><Clock size={8} /> {event.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Day: Kwame's Activity */}
        <div className="glass-panel p-5 flex flex-col border border-alert-red/30">
          <h3 className="text-sm font-bold uppercase tracking-widest text-alert-red mb-4 flex items-center gap-2">
            <AlertTriangle size={14} /> Threat Day — Kwame Mensah
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {[
              { time: '11:00 PM', action: 'Login from Unknown VPN', icon: <User size={12} />, detail: 'Accra, GH • Unrecognized Device • ⚠️ Flagged', danger: true },
              { time: '11:01 PM', action: 'Navigated to AI Algorithm Folder', icon: <FileText size={12} />, detail: 'Anomaly: Account flagged "recently resigned"', danger: true },
              { time: '11:02 PM', action: 'Bulk Download Initiated (47 files)', icon: <Zap size={12} />, detail: '🚨 ANOMALY: Mass exfiltration pattern detected', danger: true },
              { time: '11:02 PM', action: '⛔ SESSION REVOKED BY SYSTEM', icon: <Lock size={12} />, detail: 'Real-Time Monitor auto-terminated JWT token', system: true },
              { time: '11:02 PM', action: '🔒 FILES LOCKED', icon: <Lock size={12} />, detail: '12 files in AI Algorithm/ locked from download', system: true },
              { time: '11:02 PM', action: '🚨 EMERGENCY ALERT SENT', icon: <AlertTriangle size={12} />, detail: 'IT Security Team notified via Dashboard + SMS', system: true },
              { time: '11:03 PM', action: '📋 FORENSIC AUDIT GENERATED', icon: <FileText size={12} />, detail: 'Incident #TF-2024-0087 — Evidence for Legal Team', system: true },
            ].map((event, i) => (
              <div key={i} className={`flex gap-3 p-3 rounded-lg border ${event.system ? 'bg-yellow-500/10 border-yellow-500/30' : event.danger ? 'bg-alert-red/10 border-alert-red/30' : 'bg-white/5 border-glass-border/50'}`}>
                <div className={`p-1.5 rounded mt-0.5 ${event.system ? 'bg-yellow-500/20 text-yellow-500' : 'bg-alert-red/10 text-alert-red'}`}>{event.icon}</div>
                <div>
                  <div className={`text-xs font-bold ${event.system ? 'text-yellow-400' : ''}`}>{event.action}</div>
                  <div className="text-[10px] text-text-secondary mt-0.5">{event.detail}</div>
                  <div className="text-[10px] text-text-secondary flex items-center gap-1 mt-1"><Clock size={8} /> {event.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Incident Feed */}
        <div className="glass-panel p-5 flex flex-col border border-sentinel-teal/30">
          <h3 className="text-sm font-bold uppercase tracking-widest text-sentinel-teal mb-4 flex items-center gap-2">
            <Zap size={14} className="animate-pulse" /> Real-Time Security Feed
          </h3>
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {realLogs.length > 0 ? realLogs.map((log) => (
              <div key={log.id} className={`flex gap-3 p-3 rounded-lg border transition-all hover:bg-white/5 ${log.risk_score > 50 ? 'bg-alert-red/10 border-alert-red/30' : 'bg-white/5 border-glass-border/50'}`}>
                <div className={`p-1.5 rounded mt-0.5 ${log.risk_score > 50 ? 'bg-alert-red/20 text-alert-red' : 'bg-sentinel-teal/20 text-sentinel-teal'}`}>
                  {log.event_type.includes('DOWNLOAD') ? <Zap size={12} /> : log.event_type.includes('UPLOAD') ? <FileText size={12} /> : <User size={12} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-bold truncate">{log.event_type.replace(/_/g, ' ')}</div>
                    <div className={`text-[10px] font-bold ${log.risk_score > 50 ? 'text-alert-red' : 'text-sentinel-teal'}`}>{log.risk_score}</div>
                  </div>
                  <div className="text-[10px] text-text-secondary mt-0.5 truncate">{log.user_email || 'SYSTEM'}</div>
                  <div className="text-[10px] text-text-secondary mt-0.5 italic truncate">{log.file_name || log.details || 'No details'}</div>
                  <div className="text-[10px] text-text-secondary flex items-center gap-1 mt-1 opacity-70">
                    <Clock size={8} /> 
                    {log.created_at ? new Date(log.created_at.replace(' ', 'T')).toLocaleTimeString() : 'Just now'}
                  </div>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <Activity size={32} className="mb-2" />
                <p className="text-xs">Waiting for live events...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Ticker */}
      <div className="h-12 glass-panel flex items-center px-6 gap-6 relative overflow-hidden select-none">
        <div className="text-[10px] uppercase tracking-widest text-sentinel-teal font-black whitespace-nowrap">LIVE FEED</div>
        <div className="w-px h-4 bg-glass-border"></div>
        <div className="flex-1 whitespace-nowrap text-xs font-mono text-text-secondary flex gap-12 animate-marquee">
          <span>09:14 — Amara Okafor accessed ai_core_algorithm_v3.py [NORMAL]</span>
          <span className="text-alert-red">23:02 — 🚨 KWAME MENSAH BULK DOWNLOAD BLOCKED — SESSION REVOKED</span>
          <span>23:18 — IT Security acknowledged Incident #TF-2024-0087</span>
          <span>09:14 — Amara Okafor accessed ai_core_algorithm_v3.py [NORMAL]</span>
          <span className="text-alert-red">23:02 — 🚨 KWAME MENSAH BULK DOWNLOAD BLOCKED — SESSION REVOKED</span>
          <span>23:18 — IT Security acknowledged Incident #TF-2024-0087</span>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 168, 150, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 168, 150, 0.4);
        }
      `}</style>
    </div>
  );
};

export default MonitoringWall;
