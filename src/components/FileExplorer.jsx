import React, { useState } from 'react';
import { Folder, FolderOpen, File, MoreVertical, Shield, Clock, Eye, Download } from 'lucide-react';
import RiskBadge from './RiskBadge';

const MOCK_FILES = [
  { id: 1, name: 'Product Roadmap.pptx', classification: 'Confidential', riskScore: 12, riskLevel: 'low', accessCount: 24, size: '4.2 MB' },
  { id: 2, name: 'Q3_Financial_Projections.xlsx', classification: 'Restricted', riskScore: 45, riskLevel: 'medium', accessCount: 8, size: '1.5 MB' },
  { id: 3, name: 'Core_Logic_V2.bin', classification: 'Secret', riskScore: 88, riskLevel: 'high', accessCount: 156, size: '128 KB' },
  { id: 4, name: 'Patent_Application_Draft.docx', classification: 'Confidential', riskScore: 5, riskLevel: 'low', accessCount: 2, size: '840 KB' },
  { id: 5, name: 'User_Feedback_Summary.pdf', classification: 'Internal', riskScore: 2, riskLevel: 'low', accessCount: 42, size: '2.1 MB' },
  { id: 6, name: 'System_Architecture_Diagram.svg', classification: 'Confidential', riskScore: 18, riskLevel: 'low', accessCount: 12, size: '450 KB' },
];

const FileExplorer = ({ onFileSelect }) => {
  const [selectedFolder, setSelectedFolder] = useState('Research & Development');

  return (
    <div className="flex h-full gap-6">
      {/* Folder Tree */}
      <div className="w-64 glass-panel p-4 overflow-y-auto hidden lg:block">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4 px-2">Folders</h3>
        <div className="space-y-1">
          <FolderItem label="Corporate Strategy" />
          <FolderItem label="Financial Records" />
          <FolderItem label="Research & Development" active={selectedFolder === 'Research & Development'} onClick={() => setSelectedFolder('Research & Development')} />
          <div className="ml-4 space-y-1 mt-1 border-l border-glass-border pl-2">
            <FolderItem label="Project Sentinel" active />
            <FolderItem label="Legacy Archives" />
          </div>
          <FolderItem label="Human Resources" />
          <FolderItem label="Legal & Compliance" />
        </div>
      </div>

      {/* File Grid Area */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between glass-panel p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-secondary">Vault</span>
            <span className="text-text-secondary">/</span>
            <span className="text-text-secondary">R&D</span>
            <span className="text-text-secondary">/</span>
            <span className="font-semibold text-sentinel-teal">Project Sentinel</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-text-secondary font-medium mr-2">Showing {MOCK_FILES.length} items</div>
            <button className="px-3 py-1.5 bg-sentinel-teal hover:bg-sentinel-teal/80 text-white rounded-lg text-xs font-bold transition-colors">
              Upload Protected File
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_FILES.map(file => (
            <FileCard key={file.id} file={file} onClick={() => onFileSelect(file)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FolderItem = ({ label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
      active ? 'bg-sentinel-teal/20 text-sentinel-teal font-semibold' : 'text-text-secondary hover:bg-glass-bg hover:text-white'
    }`}
  >
    {active ? <FolderOpen size={16} /> : <Folder size={16} />}
    <span>{label}</span>
  </button>
);

const FileCard = ({ file, onClick }) => (
  <div 
    onClick={onClick}
    className="glass-panel p-4 hover:border-sentinel-teal/50 transition-all group flex flex-col cursor-pointer"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-glass-bg rounded-xl group-hover:bg-sentinel-teal/10 transition-colors">
        <File size={24} className="text-text-secondary group-hover:text-sentinel-teal transition-colors" />
      </div>
      <div className="flex items-center gap-2">
        <RiskBadge level={file.riskLevel} score={file.riskScore} />
        <button className="p-1 hover:bg-glass-bg rounded-lg">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>

    <div className="mb-4">
      <div className="font-bold text-sm mb-1 truncate">{file.name}</div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-midnight-blue border border-glass-border uppercase tracking-widest font-bold opacity-70">
          {file.classification}
        </span>
        <span className="text-xs text-text-secondary">{file.size}</span>
      </div>
    </div>

    <div className="mt-auto pt-4 border-t border-glass-border flex items-center justify-between">
      <div className="flex items-center gap-3 text-xs text-text-secondary">
        <div className="flex items-center gap-1">
          <Eye size={12} />
          <span>{file.accessCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Shield size={12} />
          <span className="text-[10px]">VERIFIED</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="p-2 hover:bg-glass-bg rounded-lg text-text-secondary hover:text-white transition-colors" title="Preview">
          <Eye size={16} />
        </button>
        <button className="p-2 hover:bg-glass-bg rounded-lg text-text-secondary hover:text-white transition-colors" title="Secure Download">
          <Download size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default FileExplorer;
