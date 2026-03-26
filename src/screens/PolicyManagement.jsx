import React, { useState } from 'react';
import { Shield, Plus, ArrowRight, Clock, MapPin, Network, Brain, Send, MoreHorizontal } from 'lucide-react';

const PolicyManagement = () => {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: 'Ex-Regional Data Shield',
      description: 'Block access to R&D folder from outside corporate network during non-business hours.',
      status: 'active',
      rules: [
        { type: 'Folder', value: 'R&D', op: 'IF' },
        { type: 'Network', value: 'Outside Corp', op: 'AND' },
        { type: 'Time', value: 'Outside Business Hours', op: 'AND' }
      ],
      actions: ['Require 2FA', 'Apply Watermark', 'Notify Security']
    }
  ]);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Policy Engine</h2>
          <p className="text-sm text-text-secondary">Orchestrate automated security responses based on behavioral patterns.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-sentinel-teal text-white rounded-lg text-sm font-bold shadow-lg shadow-sentinel-teal/20 hover:bg-sentinel-teal/80 transition-all">
          <Plus size={18} />
          CREATE POLICY
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Policy Builder / Editor */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="glass-panel p-6 flex-1 flex flex-col border-2 border-dashed border-sentinel-teal/20 bg-sentinel-teal/[0.02]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-sentinel-teal">Visual Policy Builder</h3>
              <div className="text-[10px] font-bold text-text-secondary px-2 py-1 bg-white/5 rounded">DRAFTING MODE</div>
            </div>

            <div className="flex flex-col items-center gap-4 py-12">
              <RuleNode icon={<Network size={20} />} label="IF: Source Location" value="Outside Corporate HQ" />
              <ArrowRight className="rotate-90 text-text-secondary opacity-30" size={24} />
              <RuleNode icon={<Brain size={20} />} label="AND: Access Pattern" value="Unusual Frequency" />
              <ArrowRight className="rotate-90 text-text-secondary opacity-30" size={24} />
              <div className="w-full max-w-md p-6 bg-alert-red/10 border border-alert-red/30 rounded-2xl flex flex-col items-center text-center">
                <div className="p-3 bg-alert-red/20 rounded-full mb-4">
                  <Shield size={24} className="text-alert-red" />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-alert-red mb-2">Then Trigger Actions</div>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-alert-red/20 rounded-full text-[10px] font-bold">LOCK ACCESS</span>
                  <span className="px-3 py-1 bg-alert-red/20 rounded-full text-[10px] font-bold">AUTO-AUDIT</span>
                  <span className="px-3 py-1 bg-alert-red/20 rounded-full text-[10px] font-bold">CEO_NOTIFY</span>
                </div>
              </div>
            </div>
            
            <div className="mt-auto flex justify-center gap-4">
               <button className="px-8 py-2 bg-glass-bg border border-glass-border rounded-lg text-xs font-bold">RESET BUILDER</button>
               <button className="px-8 py-2 bg-white text-midnight-blue rounded-lg text-xs font-black">DEPLOY POLICY</button>
            </div>
          </div>
        </div>

        {/* Existing Policies List */}
        <div className="xl:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary px-2">Active Policies</h3>
          {policies.map(policy => (
            <div key={policy.id} className="glass-panel p-5 space-y-4 hover:border-sentinel-teal/40 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-sentinel-teal/10 rounded-lg">
                  <Shield size={20} className="text-sentinel-teal" />
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-safe-green"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-safe-green">Active</span>
                   <button className="p-1 hover:bg-glass-bg rounded"><MoreHorizontal size={14} /></button>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm">{policy.name}</h4>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{policy.description}</p>
              </div>
              <div className="pt-4 border-t border-glass-border flex items-center justify-between text-[10px] font-bold">
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-text-secondary" />
                  <span>EDITED 2H AGO</span>
                </div>
                <div className="text-sentinel-teal">14 TRIGGERS (24H)</div>
              </div>
            </div>
          ))}
          
          <div className="glass-panel p-5 border-dashed opacity-50 space-y-1 text-center py-8">
            <Plus className="mx-auto text-text-secondary mb-2" size={24} />
            <div className="text-xs font-bold text-text-secondary">Drag Components Here</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RuleNode = ({ icon, label, value }) => (
  <div className="w-full max-w-md p-4 bg-white/5 border border-glass-border rounded-xl flex items-center justify-between hover:bg-white/10 transition-all cursor-move group">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-glass-bg rounded-lg group-hover:text-sentinel-teal transition-colors">
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-bold text-text-secondary uppercase">{label}</div>
        <div className="text-sm font-medium">{value}</div>
      </div>
    </div>
    <div className="w-6 h-6 flex flex-col gap-1 items-center justify-center opacity-30 select-none">
      <div className="w-4 h-0.5 bg-white"></div>
      <div className="w-4 h-0.5 bg-white"></div>
      <div className="w-4 h-0.5 bg-white"></div>
    </div>
  </div>
);

export default PolicyManagement;
