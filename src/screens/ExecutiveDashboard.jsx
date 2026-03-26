import React, { useEffect, useRef } from 'react';
import { Shield, Zap, Users, FileText, Globe } from 'lucide-react';
import * as d3 from 'd3';

const ExecutiveDashboard = () => {
  const globeRef = useRef(null);

  useEffect(() => {
    // Basic D3 setup for a "pulse" effect representing global monitoring
    if (!globeRef.current) return;

    const svg = d3.select(globeRef.current);
    const width = 300;
    const height = 300;
    
    svg.selectAll("*").remove();
    
    const g = svg.append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    // Draw rings
    for (let i = 1; i <= 3; i++) {
      g.append("circle")
        .attr("r", i * 40)
        .attr("fill", "none")
        .attr("stroke", "var(--color-sentinel-teal)")
        .attr("stroke-width", 1)
        .attr("opacity", 0.5 / i)
        .append("animate")
        .attr("attributeName", "r")
        .attr("from", i * 40)
        .attr("to", (i + 1) * 40)
        .attr("dur", "3s")
        .attr("repeatCount", "indefinite");
        
      g.append("circle")
        .attr("r", i * 40)
        .attr("fill", "none")
        .attr("stroke", "var(--color-sentinel-teal)")
        .attr("stroke-width", 1)
        .attr("opacity", 0.5 / i)
        .append("animate")
        .attr("attributeName", "opacity")
        .attr("from", 0.5 / i)
        .attr("to", 0)
        .attr("dur", "3s")
        .attr("repeatCount", "indefinite");
    }

    // Central Sphere
    const gradient = svg.append("defs")
      .append("radialGradient")
      .attr("id", "globeGradient");
    
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "var(--color-sentinel-teal)");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "var(--color-midnight-blue)");

    g.append("circle")
      .attr("r", 35)
      .attr("fill", "url(#globeGradient)")
      .attr("filter", "blur(2px)");

    // Add random dots for access points
    for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 40 + Math.random() * 80;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        g.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 3)
            .attr("fill", "var(--color-sentinel-teal)")
            .attr("opacity", 0.8)
            .append("animate")
            .attr("attributeName", "opacity")
            .attr("values", "0.8;0.2;0.8")
            .attr("dur", `${2 + Math.random() * 2}s`)
            .attr("repeatCount", "indefinite");
            
        g.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", x)
            .attr("y2", y)
            .attr("stroke", "var(--color-sentinel-teal)")
            .attr("stroke-width", 0.5)
            .attr("opacity", 0.2);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={<FileText className="text-sentinel-teal" />} label="Files Accessed (24h)" value="1,284" trend="+12%" />
        <MetricCard icon={<Zap className="text-yellow-500" />} label="Unusual Activities" value="3" trend="-20%" />
        <MetricCard icon={<Users className="text-blue-500" />} label="Active Sessions" value="42" trend="+5" />
        <MetricCard icon={<Shield className="text-safe-green" />} label="Compliance Status" value="98.2%" trend="Stable" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animated Visualization Area */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <Globe size={20} className="text-sentinel-teal" />
            <h3 className="font-bold">Global Access Monitoring</h3>
          </div>
          
          <svg 
            ref={globeRef} 
            width="300" 
            height="300" 
            className="drop-shadow-[0_0_15px_rgba(0,168,150,0.3)]"
          />
          
          <div className="mt-8 text-center">
            <div className="text-4xl font-black text-white mb-2">12</div>
            <div className="text-xs uppercase tracking-[0.2em] text-sentinel-teal font-bold">Aggregate System Risk Score</div>
            <p className="text-text-secondary text-sm mt-4 max-w-md">
              Real-time heuristic analysis active across 14 global regions. Status: <span className="text-safe-green font-bold text-[10px] tracking-widest uppercase ml-1">Optimal</span>
            </p>
          </div>
        </div>

        {/* Risk Breakdown Area */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Zap size={20} className="text-sentinel-teal" />
              Risk Breakdown
            </h3>
            <div className="space-y-6">
              <RiskFactor label="Authentication Strength" value={95} color="var(--color-safe-green)" />
              <RiskFactor label="Location Security" value={72} color="var(--color-sentinel-teal)" />
              <RiskFactor label="Behavioral Anomaly" value={15} color="var(--color-alert-red)" />
              <RiskFactor label="Device Compliance" value={88} color="var(--color-sentinel-teal)" />
            </div>
          </div>
          
          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Active Alerts</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-alert-red font-bold">3 CRITICAL</span>
            </div>
            <div className="text-sm font-medium">Multiple failed logins from unknown region.</div>
            <button className="w-full mt-4 py-2 bg-glass-bg hover:bg-glass-border rounded-lg text-xs font-bold transition-all border border-glass-border">
              VIEW ALERT QUEUE
            </button>
          </div>
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
      <div className={`text-xs font-semibold ${trend.startsWith('-') ? 'text-alert-red' : 'text-safe-green'}`}>
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
      <div 
        className="h-full transition-all duration-1000" 
        style={{ width: `${value}%`, backgroundColor: color }}
      ></div>
    </div>
  </div>
);

export default ExecutiveDashboard;
