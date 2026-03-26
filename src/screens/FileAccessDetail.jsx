import React, { useState } from 'react';
import { ArrowLeft, Shield, Clock, Eye, Download, User, MapPin, Calendar, Info, Lock, Search } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

const FileAccessDetail = ({ file, onBack }) => {
  const [activeTimelineTab, setActiveTimelineTab] = useState('all');

  const timelineEvents = [
    { id: 1, user: 'John Doe', action: 'Viewed', time: '10:42 AM', date: 'Oct 24, 2023', location: 'New York, US', risk: 'low' },
    { id: 2, user: 'Sarah Smith', action: 'Downloaded', time: '09:15 AM', date: 'Oct 24, 2023', location: 'London, UK', risk: 'medium' },
    { id: 3, user: 'System Auto-Sweep', action: 'Encryption Verified', time: '02:00 AM', date: 'Oct 24, 2023', location: 'Cloud AWS-US-East', risk: 'low' },
    { id: 4, user: 'Anomalous Entry', action: 'Access Blocked', time: '11:45 PM', date: 'Oct 23, 2023', location: 'Unknown', risk: 'high' },
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-glass-bg rounded-lg transition-colors text-text-secondary hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            {file.name}
            <span className="text-xs px-2 py-0.5 rounded bg-midnight-blue border border-glass-border uppercase tracking-widest font-bold opacity-70">
              {file.classification}
            </span>
          </h2>
          <div className="text-sm text-text-secondary mt-1">UUID: {Math.random().toString(36).substr(2, 16).toUpperCase()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Left Panel: Metadata */}
        <div className="xl:col-span-1 space-y-6 overflow-y-auto pr-2">
          <section className="glass-panel p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-sentinel-teal">Security Profile</h3>
            <div className="flex items-center justify-between py-2 border-b border-glass-border">
              <span className="text-sm text-text-secondary">Owner</span>
              <span className="text-sm font-medium">Engineering Dept.</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-glass-border">
              <span className="text-sm text-text-secondary">Risk Score</span>
              <RiskBadge level={file.riskLevel} score={file.riskScore} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-glass-border">
              <span className="text-sm text-text-secondary">Last Audit</span>
              <span className="text-sm font-medium">2 hours ago</span>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sentinel-teal">
                <Shield size={12} />
                <span>DYNAMIC WATERMARK ACTIVE</span>
              </div>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                All views and downloads are embedded with user-specific cryptographic watermarks.
              </p>
            </div>
          </section>

          <section className="glass-panel p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-text-secondary">File Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-text-secondary font-bold uppercase">Size</div>
                <div className="text-sm">{file.size}</div>
              </div>
              <div>
                <div className="text-[10px] text-text-secondary font-bold uppercase">MIME Type</div>
                <div className="text-sm">application/vnd.ms-powerpoint</div>
              </div>
              <div className="col-span-2">
                <div className="text-[10px] text-text-secondary font-bold uppercase">Encryption</div>
                <div className="text-sm font-mono text-sentinel-teal">AES-GCM-256-XChaCha</div>
              </div>
            </div>
          </section>
        </div>

        {/* Center: File Preview */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <div className="flex-1 glass-panel relative overflow-hidden group border-2 border-sentinel-teal/20">
            {/* Watermark Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3 opacity-[0.03] select-none rotate-[-12deg] scale-150">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex items-center justify-center font-black text-4xl">
                  SENTINEL_PROTECTED_USER_ADMIN_2834
                </div>
              ))}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <div className="w-16 h-16 rounded-full bg-sentinel-teal/10 border border-sentinel-teal/30 flex items-center justify-center mb-4">
                <Lock size={32} className="text-sentinel-teal" />
              </div>
              <div className="text-lg font-bold">Secure Preview Mode</div>
              <p className="text-text-secondary text-sm mt-2 text-center px-8">
                Visualizing sensitive Intellectual Property. All access events are logged and audited.
              </p>
              <button className="mt-8 px-6 py-2 bg-sentinel-teal text-white rounded-lg font-bold hover:bg-sentinel-teal/80 transition-all flex items-center gap-2">
                <Eye size={18} />
                REVEAL CONTENT
              </button>
            </div>
            
            {/* Action Bar Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-midnight-blue/80 backdrop-blur-lg border border-glass-border rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Zoom In"><Search size={18} /></button>
              <div className="w-px h-4 bg-glass-border"></div>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Download Audit Trail"><Download size={18} /></button>
              <button className="px-4 py-1.5 bg-sentinel-teal text-white rounded-full text-xs font-bold">SECURE DOWNLOAD</button>
            </div>
          </div>
        </div>

        {/* Right Panel: Access Timeline */}
        <div className="xl:col-span-1 glass-panel flex flex-col min-h-0">
          <div className="p-5 border-b border-glass-border">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Access Timeline</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTimelineTab('all')}
                className={`text-[10px] px-2 py-1 rounded transition-colors font-bold ${activeTimelineTab === 'all' ? 'bg-sentinel-teal text-white' : 'bg-glass-bg text-text-secondary'}`}
              >
                ALL
              </button>
              <button 
                onClick={() => setActiveTimelineTab('risk')}
                className={`text-[10px] px-2 py-1 rounded transition-colors font-bold ${activeTimelineTab === 'risk' ? 'bg-alert-red text-white' : 'bg-glass-bg text-text-secondary'}`}
              >
                HIGH RISK
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {timelineEvents.map((event, idx) => (
              <TimelineItem key={event.id} event={event} isLast={idx === timelineEvents.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineItem = ({ event, isLast }) => (
  <div className="relative flex gap-4">
    {!isLast && (
      <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-glass-border"></div>
    )}
    <div className={`mt-1.5 w-[22px] h-[22px] rounded-full flex items-center justify-center z-10 ${
      event.risk === 'high' ? 'bg-alert-red/20 text-alert-red border border-alert-red/40' : 
      event.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/40' :
      'bg-sentinel-teal/20 text-sentinel-teal border border-sentinel-teal/40'
    }`}>
      <User size={10} />
    </div>
    <div className="flex-1 space-y-1 pb-6">
      <div className="flex justify-between items-start">
        <span className="text-sm font-bold">{event.user}</span>
        <span className="text-[10px] text-text-secondary">{event.time}</span>
      </div>
      <div className="text-xs text-text-secondary">
        {event.action} from <span className="text-white">{event.location}</span>
      </div>
      {event.risk === 'high' && (
        <div className="mt-2 p-2 bg-alert-red/10 border border-alert-red/20 rounded text-[10px] text-alert-red font-medium">
          Flagged: Unauthorized geographic region access attempt.
        </div>
      )}
    </div>
  </div>
);

export default FileAccessDetail;
