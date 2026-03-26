import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, Search, Mail, BarChart3 } from 'lucide-react';
import RiskBadge from './RiskBadge';

const ActivityCard = ({ activity }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const { user, action, fileName, time, location, riskScore, riskLevel, avatar } = activity;

  return (
    <div className={`glass-panel p-4 transition-all duration-300 ${isExpanded ? 'ring-1 ring-sentinel-teal/30' : 'hover:bg-white/5'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sentinel-teal/20 border border-sentinel-teal/30 flex items-center justify-center text-sentinel-teal font-bold overflow-hidden">
            {avatar ? <img src={avatar} alt={user} className="w-full h-full object-cover" /> : user.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{user}</span>
              <span className="text-text-secondary text-xs">{action}</span>
              <span className="font-medium text-sm text-sentinel-teal">"{fileName}"</span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1 text-xs text-text-secondary">
                <Clock size={12} />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-text-secondary">
                <MapPin size={12} />
                <span>{location}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <RiskBadge level={riskLevel} score={riskScore} />
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-glass-bg rounded-lg text-text-secondary transition-colors"
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-glass-border">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ActionButton icon={<Search size={14} />} label="Investigate" />
            <ActionButton icon={<Mail size={14} />} label="Contact User" />
            <ActionButton icon={<BarChart3 size={14} />} label="View Pattern" />
          </div>
          
          <div className="mt-4 p-3 bg-black/20 rounded-lg">
            <div className="text-[10px] uppercase text-text-secondary font-bold tracking-wider mb-2">Technical Logs</div>
            <pre className="text-xs font-mono text-sentinel-teal/80 overflow-x-auto">
              {`EVENT_ID: EVT_${Math.random().toString(36).substr(2, 9).toUpperCase()}
IP_ADDR: ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.0.1
UA: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)
AUTH_METHOD: OAuth2.0 + MFA (TOTP)`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ icon, label }) => (
  <button className="flex items-center justify-center gap-2 px-3 py-2 bg-glass-bg hover:bg-glass-border border border-glass-border rounded-lg text-xs font-medium transition-colors">
    {icon}
    <span>{label}</span>
  </button>
);

export default ActivityCard;
