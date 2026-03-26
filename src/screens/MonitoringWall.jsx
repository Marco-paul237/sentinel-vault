import React from 'react';
import { Shield, Activity, Map, AlertTriangle, Clock, ListFilter } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

const MonitoringWall = () => {
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-alert-red/10 rounded-lg">
            <Activity size={24} className="text-alert-red animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold">SOC Monitoring Wall</h2>
            <p className="text-xs text-text-secondary uppercase tracking-widest font-bold">Live System Pulse: 142 EPS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-4 hidden sm:block">
            <div className="text-xs font-bold text-text-secondary uppercase">Uptime</div>
            <div className="text-sm font-mono">14d 02h 34m 12s</div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-glass-bg border border-glass-border rounded-lg text-sm font-bold">
            <ListFilter size={16} />
            FILTERS
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Heatmap Placeholder */}
        <div className="xl:col-span-2 lg:col-span-2 glass-panel p-6 flex flex-col relative overflow-hidden bg-black/40">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
               <Map size={16} className="text-sentinel-teal" />
               Geographic Threat Surface
             </h3>
             <div className="flex gap-4">
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-safe-green"></div><span className="text-[10px] text-text-secondary font-bold">SECURE</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-alert-red animate-pulse"></div><span className="text-[10px] text-text-secondary font-bold">THREAT</span></div>
             </div>
           </div>
           
           <div className="flex-1 rounded-xl border border-glass-border bg-midnight-blue/40 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                {/* Visual texture for a map */}
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-1 px-4 py-4">
                  {Array.from({ length: 144 }).map((_, i) => (
                    <div key={i} className={`rounded-sm ${Math.random() > 0.8 ? 'bg-sentinel-teal/40' : 'bg-white/5'}`}></div>
                  ))}
                </div>
              </div>
              <div className="relative z-10 text-center">
                <Map size={64} className="text-sentinel-teal/20 mx-auto mb-4" />
                <div className="text-sm font-bold text-text-secondary">Interactive Heatmap Loading...</div>
              </div>
           </div>
        </div>

        {/* User Activity Matrix */}
        <div className="glass-panel p-6 flex flex-col">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
            <Shield size={16} className="text-sentinel-teal" />
            Active Session Matrix
          </h3>
          <div className="flex-1 flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="group p-3 hover:bg-white/5 rounded-lg border border-transparent hover:border-glass-border transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-alert-red animate-ping' : 'bg-safe-green'}`}></div>
                  <div className="text-xs font-bold">USER_ID_{1000 + i}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[10px] font-mono opacity-50">172.16.0.{i * 12}</div>
                  <RiskBadge level={i === 2 ? 'high' : 'low'} score={i === 2 ? 92 : 4} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Queue */}
        <div className="glass-panel p-6 flex flex-col bg-alert-red/5 border-alert-red/20 shadow-[inset_0_0_40px_rgba(255,77,77,0.05)]">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-alert-red">
            <AlertTriangle size={16} />
            High-Priority Alerts
          </h3>
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
            <AlertItem 
              id="ALR-2834" 
              title="Brute Force Attempt" 
              time="2m ago" 
              severity="high" 
              desc="Multiple failed authentications from Singapore node."
            />
            <AlertItem 
              id="ALR-2831" 
              title="Bulk Data Export" 
              time="12m ago" 
              severity="medium" 
              desc="User 'jsmith' downloaded > 500MB of sensitive docs."
            />
            <AlertItem 
              id="ALR-2829" 
              title="Untrusted Device" 
              time="45m ago" 
              severity="low" 
              desc="Access from unmanaged Linux workstation in HQ."
            />
          </div>
          <button className="w-full mt-4 py-3 bg-alert-red/20 text-alert-red hover:bg-alert-red/30 rounded-lg text-xs font-black transition-all border border-alert-red/40 uppercase tracking-widest">
            Acknowledge All
          </button>
        </div>
      </div>

      {/* Real-time Ticker */}
      <div className="h-12 glass-panel flex items-center px-6 gap-6 relative overflow-hidden select-none">
        <div className="flex items-center gap-2 text-sentinel-teal shrink-0">
          <Clock size={16} />
          <span className="text-xs font-black uppercase tracking-widest">Live Stream</span>
        </div>
        <div className="w-px h-4 bg-glass-border"></div>
        <div className="flex-1 whitespace-nowrap text-xs font-mono text-text-secondary flex gap-12 animate-marquee">
          <div>[INFO] Blocked 12 traversal attempts from 182.23.102.11</div>
          <div className="text-safe-green">[SUCCESS] Daily encryption sweep completed. 1,204 files verified.</div>
          <div className="text-alert-red">[WARN] Unusual behavioral pattern detected for user [UID_2932].</div>
          <div>[INFO] System latency within normal bounds: 42ms</div>
          <div className="text-sentinel-teal">[SENTINEL] Database integrity check PASSED at 18:24:01</div>
        </div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none"></div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

const AlertItem = ({ id, title, time, severity, desc }) => (
  <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-2 hover:bg-white/10 transition-colors cursor-pointer group">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-mono text-text-secondary">{id}</span>
      <span className="text-[10px] text-text-secondary">{time}</span>
    </div>
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${severity === 'high' ? 'bg-alert-red' : severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
      <div className="text-xs font-bold group-hover:text-white transition-colors">{title}</div>
    </div>
    <p className="text-[10px] text-text-secondary leading-normal">{desc}</p>
  </div>
);

export default MonitoringWall;
