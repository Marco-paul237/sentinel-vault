import React, { useEffect, useRef } from 'react';
import { Shield, Zap, Users, FileText, Globe, Lock, AlertTriangle, Server, Database, Cloud, Activity } from 'lucide-react';
import * as d3 from 'd3';

const ExecutiveDashboard = ({ auditLogs = [] }) => {
  const globeRef = useRef(null);
  
  const highRiskLogs = auditLogs.filter(log => log.risk_score > 60);
  const lastIncident = highRiskLogs[0] || null;

  useEffect(() => {
    if (!globeRef.current) return;
    const svg = d3.select(globeRef.current);
    const width = 300;
    const height = 300;
    svg.selectAll("*").remove();
    const g = svg.append("g").attr("transform", `translate(${width/2},${height/2})`);

    for (let i = 1; i <= 3; i++) {
      g.append("circle").attr("r", i * 40).attr("fill", "none").attr("stroke", "var(--color-sentinel-teal)").attr("stroke-width", 1).attr("opacity", 0.5 / i)
        .append("animate").attr("attributeName", "r").attr("from", i * 40).attr("to", (i + 1) * 40).attr("dur", "3s").attr("repeatCount", "indefinite");
      g.append("circle").attr("r", i * 40).attr("fill", "none").attr("stroke", "var(--color-sentinel-teal)").attr("stroke-width", 1).attr("opacity", 0.5 / i)
        .append("animate").attr("attributeName", "opacity").attr("from", 0.5 / i).attr("to", 0).attr("dur", "3s").attr("repeatCount", "indefinite");
    }

    const gradient = svg.append("defs").append("radialGradient").attr("id", "globeGradient");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "var(--color-sentinel-teal)");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "var(--color-midnight-blue)");
    g.append("circle").attr("r", 35).attr("fill", "url(#globeGradient)").attr("filter", "blur(2px)");

    // Access points for Real-time Monitoring
    const accessPoints = [
      { label: 'Primary Node', angle: 0.4, dist: 70, color: 'var(--color-safe-green)' },
      { label: 'Secondary Node', angle: 2.8, dist: 90, color: 'var(--color-sentinel-teal)' },
      { label: 'Cloud AWS', angle: 4.2, dist: 60, color: 'var(--color-sentinel-teal)' },
      { label: 'Cloud GCP', angle: 5.5, dist: 80, color: 'var(--color-sentinel-teal)' },
    ];

    accessPoints.forEach(p => {
      const x = Math.cos(p.angle) * p.dist;
      const y = Math.sin(p.angle) * p.dist;
      g.append("circle").attr("cx", x).attr("cy", y).attr("r", 4).attr("fill", p.color).attr("opacity", 0.9)
        .append("animate").attr("attributeName", "opacity").attr("values", "0.9;0.3;0.9").attr("dur", "2s").attr("repeatCount", "indefinite");
      g.append("line").attr("x1", 0).attr("y1", 0).attr("x2", x).attr("y2", y).attr("stroke", p.color).attr("stroke-width", 0.8).attr("opacity", 0.3);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="glass-panel p-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight">TechForge Solutions</h2>
          <p className="text-xs text-text-secondary mt-1">Cloud-Native IP Protection File System — Proprietary AI Algorithm Vault</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-alert-red/20 border border-alert-red/40 rounded-full text-[10px] font-bold text-alert-red animate-pulse">
            1 ACTIVE INCIDENT
          </div>
          <div className="px-3 py-1 bg-safe-green/20 border border-safe-green/40 rounded-full text-[10px] font-bold text-safe-green">
            SYSTEM OPERATIONAL
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<FileText className="text-sentinel-teal" />} label="Protected IP Files" value="2,847" trend="+34" />
        <MetricCard icon={<AlertTriangle className="text-alert-red" />} label="Threats Blocked (30d)" value="12" trend="+3" />
        <MetricCard icon={<Users className="text-blue-500" />} label="Active Developers" value="18" trend="Stable" />
        <MetricCard icon={<Shield className="text-safe-green" />} label="Encryption Coverage" value="100%" trend="AES-256" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Globe Visualization */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <Globe size={20} className="text-sentinel-teal" />
            <h3 className="font-bold">Global Access Monitoring</h3>
          </div>
          <svg ref={globeRef} width="300" height="300" className="drop-shadow-[0_0_15px_rgba(0,168,150,0.3)]" />
          <div className="mt-8 text-center">
            <div className="text-4xl font-black text-white mb-2">7</div>
            <div className="text-xs uppercase tracking-[0.2em] text-sentinel-teal font-bold">Aggregate System Risk Score</div>
            <p className="text-text-secondary text-sm mt-4 max-w-md">
              Monitoring TechForge&apos;s AI algorithm vault across 4 global nodes. Status: <span className="text-safe-green font-bold text-[10px] tracking-widest uppercase ml-1">Secure</span>
            </p>
          </div>
        </div>

        {/* Risk Breakdown — Threat Scenario */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Zap size={20} className="text-sentinel-teal" />
              Security Posture
            </h3>
            <div className="space-y-6">
              <RiskFactor label="MFA Compliance" value={100} color="var(--color-safe-green)" />
              <RiskFactor label="JWT Token Integrity" value={98} color="var(--color-safe-green)" />
              <RiskFactor label="Behavioral Anomaly Index" value={72} color="var(--color-alert-red)" />
              <RiskFactor label="RBAC Policy Coverage" value={95} color="var(--color-sentinel-teal)" />
            </div>
          </div>
          
          <div className="mt-8 p-4 rounded-xl bg-alert-red/10 border border-alert-red/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Last Critical Incident</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${lastIncident ? 'bg-alert-red animate-pulse' : 'bg-safe-green'}`}>
                {lastIncident ? 'ACTIVE' : 'NONE'}
              </span>
            </div>
            {lastIncident ? (
              <>
                <div className="text-sm font-medium">{lastIncident.event_type.replace(/_/g, ' ')} — {lastIncident.details}</div>
                <div className="text-[10px] text-text-secondary mt-1">{lastIncident.created_at ? new Date(lastIncident.created_at.replace(' ', 'T')).toLocaleString() : 'Just now'} • Recorded by SENTINEL CORE.</div>
              </>
            ) : (
              <div className="text-sm font-medium text-text-secondary">No critical incidents recently recorded. System is secure.</div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-sentinel-teal">
          <Activity size={20} />
          Recent Security Stream
        </h3>
        <div className="space-y-2">
          {auditLogs.slice(0, 5).map(log => (
            <div key={log.id} className="flex items-center justify-between p-3 bg-white/5 border border-glass-border rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${log.risk_score > 50 ? 'bg-alert-red' : 'bg-sentinel-teal'}`}></div>
                <div>
                  <div className="text-sm font-bold">{log.event_type.replace(/_/g, ' ')}</div>
                  <div className="text-[10px] text-text-secondary">{log.user_email}</div>
                </div>
              </div>
              <div className="text-xs font-mono text-text-secondary">
                {log.created_at ? new Date(log.created_at.replace(' ', 'T')).toLocaleTimeString() : '--:--:--'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, trend }) => (
  <div className="glass-panel p-5 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      {React.cloneElement(icon, { size: 48 })}
    </div>
    <div className="relative z-10">
      <div className="text-text-secondary text-sm font-medium mb-1">{label}</div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className={`text-xs font-semibold ${trend.startsWith && trend.startsWith('-') ? 'text-alert-red' : 'text-safe-green'}`}>
        {trend} <span className="text-text-secondary font-normal ml-1">vs last period</span>
      </div>
    </div>
  </div>
);

const RiskFactor = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-medium">
      <span className="text-text-secondary">{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className="h-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color }}></div>
    </div>
  </div>
);

export default ExecutiveDashboard;
