import React, { useState, useEffect, useRef } from 'react';
import { Folder, FolderOpen, FolderPlus, File, Shield, Eye, Download, Lock, Upload, X, CheckCircle, Trash2, ChevronRight } from 'lucide-react';

const API = 'http://localhost:4000/api';

const FileExplorer = ({ onFileSelect, token, onUpload }) => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null); // null = "All Files"
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [classification, setClassification] = useState('Confidential');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchFolders();
    fetchFiles();
  }, [token]);

  useEffect(() => {
    fetchFiles();
  }, [selectedFolder]);

  const fetchFolders = async () => {
    try {
      const res = await fetch(`${API}/folders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setFolders(await res.json());
    } catch (err) {
      console.error('Failed to fetch folders', err);
    }
  };

  const fetchFiles = async () => {
    try {
      const url = selectedFolder 
        ? `${API}/files/list?folder_id=${selectedFolder.id}` 
        : `${API}/files/list`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setFiles(await res.json());
    } catch (err) {
      console.error('Failed to fetch files', err);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      const res = await fetch(`${API}/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newFolderName, parent_id: newFolderParent })
      });
      if (res.ok) {
        setNewFolderName('');
        setShowNewFolder(false);
        setNewFolderParent(null);
        fetchFolders();
        onUpload?.();
      }
    } catch (err) {
      console.error('Failed to create folder', err);
    }
  };

  const handleDeleteFolder = async (folderId, e) => {
    e.stopPropagation();
    if (!confirm('Delete this folder? Files inside will be moved to root.')) return;
    try {
      await fetch(`${API}/folders/${folderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (selectedFolder?.id === folderId) setSelectedFolder(null);
      fetchFolders();
      fetchFiles();
      onUpload?.();
    } catch (err) {
      console.error('Failed to delete folder', err);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadSuccess('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('classification', classification);
      if (selectedFolder) formData.append('folder_id', selectedFolder.id);

      const res = await fetch(`${API}/files/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setUploadSuccess(`✅ "${data.name}" uploaded & encrypted!`);
        fetchFiles();
        onUpload?.();
        setTimeout(() => setUploadSuccess(''), 5000);
      } else {
        const err = await res.json();
        setUploadSuccess(`❌ Upload failed: ${err.error}`);
      }
    } catch (err) {
      setUploadSuccess(`❌ Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (file, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`${API}/files/download/${file.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.original_name;
        a.click();
        URL.revokeObjectURL(url);
        onUpload?.();
      }
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const handleDelete = async (file, e) => {
    e.stopPropagation();
    if (!confirm(`Delete "${file.original_name}"?`)) return;
    try {
      await fetch(`${API}/files/${file.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchFiles();
      onUpload?.();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  // Build folder tree structure
  const rootFolders = folders.filter(f => !f.parent_id);
  const getChildren = (parentId) => folders.filter(f => f.parent_id === parentId);

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar — Real Folder Tree */}
      <div className="w-64 glass-panel p-4 overflow-y-auto hidden lg:flex flex-col">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4 px-2">TechForge Vault</h3>
        
        <div className="space-y-1 flex-1">
          {/* All Files (root) */}
          <button 
            onClick={() => setSelectedFolder(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedFolder ? 'bg-sentinel-teal/20 text-sentinel-teal font-semibold' : 'text-text-secondary hover:bg-glass-bg hover:text-white'
            }`}
          >
            {!selectedFolder ? <FolderOpen size={16} /> : <Folder size={16} />}
            <span>All Files</span>
          </button>

          {/* Dynamic Folders */}
          {rootFolders.map(folder => (
            <FolderTreeItem 
              key={folder.id} 
              folder={folder} 
              selectedFolder={selectedFolder} 
              onSelect={setSelectedFolder}
              onDelete={handleDeleteFolder}
              children={getChildren(folder.id)}
              getChildren={getChildren}
            />
          ))}
        </div>

        {/* Create Folder UI */}
        <div className="mt-4 pt-4 border-t border-glass-border">
          {showNewFolder ? (
            <form onSubmit={handleCreateFolder} className="space-y-2">
              <input 
                value={newFolderName} 
                onChange={e => setNewFolderName(e.target.value)} 
                placeholder="Folder name..."
                autoFocus
                className="w-full px-3 py-2 bg-white/5 border border-glass-border rounded-lg text-white text-sm placeholder-text-secondary focus:border-sentinel-teal"
              />
              <select
                value={newFolderParent || ''}
                onChange={e => setNewFolderParent(e.target.value || null)}
                className="w-full px-3 py-1.5 bg-white/5 border border-glass-border rounded-lg text-white text-xs"
              >
                <option value="">Root (no parent)</option>
                {folders.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-1.5 bg-sentinel-teal text-white rounded-lg text-xs font-bold">Create</button>
                <button type="button" onClick={() => { setShowNewFolder(false); setNewFolderName(''); }} className="flex-1 py-1.5 bg-white/5 rounded-lg text-xs font-bold">Cancel</button>
              </div>
            </form>
          ) : (
            <button 
              onClick={() => setShowNewFolder(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sentinel-teal hover:bg-sentinel-teal/10 transition-colors font-medium"
            >
              <FolderPlus size={16} />
              <span>New Folder</span>
            </button>
          )}
        </div>
      </div>

      {/* File Grid Area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between glass-panel p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-secondary">Vault</span>
            <ChevronRight size={14} className="text-text-secondary" />
            <span className="font-semibold text-sentinel-teal">{selectedFolder ? selectedFolder.name : 'All Files'}</span>
            <span className="text-text-secondary ml-2">({files.length} items)</span>
          </div>
          <div className="flex items-center gap-3">
            <select value={classification} onChange={e => setClassification(e.target.value)} className="text-xs bg-white/5 border border-glass-border rounded-lg px-2 py-1.5 text-white">
              <option value="Internal">Internal</option>
              <option value="Confidential">Confidential</option>
              <option value="Restricted">Restricted</option>
              <option value="Top Secret">Top Secret</option>
            </select>
            <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-4 py-1.5 bg-sentinel-teal hover:bg-sentinel-teal/80 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50">
              {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Encrypting...' : 'Upload File'}
            </button>
          </div>
        </div>

        {uploadSuccess && (
          <div className={`p-3 rounded-lg text-sm font-medium ${uploadSuccess.startsWith('✅') ? 'bg-safe-green/20 text-safe-green border border-safe-green/30' : 'bg-alert-red/20 text-alert-red border border-alert-red/30'}`}>
            {uploadSuccess}
          </div>
        )}

        {files.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <Upload size={48} className="mx-auto text-text-secondary mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-2">
              {selectedFolder ? `No files in "${selectedFolder.name}"` : 'No files yet'}
            </h3>
            <p className="text-sm text-text-secondary">Upload a file to see it encrypted and stored securely.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {files.map(file => (
              <FileCard key={file.id} file={file} onClick={() => onFileSelect(file)} onDownload={handleDownload} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Recursive folder tree item
const FolderTreeItem = ({ folder, selectedFolder, onSelect, onDelete, children, getChildren }) => {
  const isActive = selectedFolder?.id === folder.id;

  return (
    <div>
      <div className={`group flex items-center rounded-lg transition-colors ${isActive ? 'bg-sentinel-teal/20' : 'hover:bg-glass-bg'}`}>
        <button
          onClick={() => onSelect(folder)}
          className={`flex-1 flex items-center gap-2 px-3 py-2 text-sm ${isActive ? 'text-sentinel-teal font-semibold' : 'text-text-secondary hover:text-white'}`}
        >
          {isActive ? <FolderOpen size={16} /> : <Folder size={16} />}
          <span className="truncate">{folder.name}</span>
        </button>
        <button 
          onClick={(e) => onDelete(folder.id, e)}
          className="p-1 mr-1 opacity-0 group-hover:opacity-100 hover:bg-alert-red/20 rounded text-text-secondary hover:text-alert-red transition-all"
          title="Delete folder"
        >
          <Trash2 size={12} />
        </button>
      </div>
      {/* Render child folders */}
      {children.length > 0 && (
        <div className="ml-4 space-y-1 mt-1 border-l border-glass-border pl-2">
          {children.map(child => (
            <FolderTreeItem 
              key={child.id} 
              folder={child} 
              selectedFolder={selectedFolder} 
              onSelect={onSelect} 
              onDelete={onDelete}
              children={getChildren(child.id)}
              getChildren={getChildren}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileCard = ({ file, onClick, onDownload, onDelete }) => {
  const isTopSecret = file.classification === 'Top Secret';
  const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(1)} KB`;

  return (
    <div onClick={onClick} className={`glass-panel p-4 hover:border-sentinel-teal/50 transition-all group flex flex-col cursor-pointer ${isTopSecret ? 'border-alert-red/30' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl transition-colors ${isTopSecret ? 'bg-alert-red/10' : 'bg-glass-bg group-hover:bg-sentinel-teal/10'}`}>
          {isTopSecret ? <Lock size={24} className="text-alert-red" /> : <File size={24} className="text-text-secondary group-hover:text-sentinel-teal transition-colors" />}
        </div>
        <button onClick={(e) => onDelete(file, e)} className="p-1 hover:bg-alert-red/20 rounded-lg text-text-secondary hover:text-alert-red transition-colors" title="Delete">
          <X size={16} />
        </button>
      </div>
      <div className="mb-4">
        <div className="font-bold text-sm mb-1 truncate font-mono">{file.original_name}</div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-widest font-bold ${isTopSecret ? 'bg-alert-red/20 text-alert-red border border-alert-red/30' : 'bg-midnight-blue border border-glass-border opacity-70'}`}>{file.classification}</span>
          <span className="text-xs text-text-secondary">{sizeStr}</span>
        </div>
      </div>
      <div className="mt-auto pt-4 border-t border-glass-border flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <div className="flex items-center gap-1"><Shield size={12} /><span className="text-[10px]">AES-256</span></div>
          <div className="flex items-center gap-1"><CheckCircle size={12} className="text-safe-green" /><span className="text-[10px]">ENCRYPTED</span></div>
        </div>
        <button onClick={(e) => onDownload(file, e)} className="p-2 hover:bg-sentinel-teal/20 rounded-lg text-text-secondary hover:text-sentinel-teal transition-colors" title="Download & Decrypt">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};

export default FileExplorer;
