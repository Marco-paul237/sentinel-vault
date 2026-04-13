import React, { useState, useEffect, useRef } from 'react';
import { Folder, FolderOpen, FolderPlus, File, Shield, Eye, Download, Lock, Upload, X, CheckCircle, Trash2, ChevronRight, Plus, Tag as TagIcon, Edit2 } from 'lucide-react';

const API = '/api';

const FileExplorer = ({ onFileSelect, token, onUpload, user }) => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [classification, setClassification] = useState('Confidential');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderParent, setNewFolderParent] = useState(null);
  
  // Custom Fields (Tags) State
  const [newTag, setNewTag] = useState('');
  const [currentTags, setCurrentTags] = useState([]);
  
  const fileInputRef = useRef(null);
  const isAdmin = user?.role === 'admin';
  const isEngineer = user?.role === 'engineer' || isAdmin;

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

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      setCurrentTags([...currentTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setCurrentTags(currentTags.filter(t => t !== tag));
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
      formData.append('tags', JSON.stringify(currentTags));
      if (selectedFolder) formData.append('folder_id', selectedFolder.id);

      const res = await fetch(`${API}/files/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setUploadSuccess(`✅ "${data.name}" uploaded successfully!`);
        setCurrentTags([]);
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
    if (!confirm(`Permanently delete "${file.original_name}"?`)) return;
    try {
      const res = await fetch(`${API}/files/${file.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchFiles();
        onUpload?.();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (err) {
      console.error('Delete failed', err);
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
        fetchFolders();
        onUpload?.();
      }
    } catch (err) {
      console.error('Failed to create folder', err);
    }
  };

  const rootFolders = folders.filter(f => !f.parent_id);
  const getChildren = (parentId) => folders.filter(f => f.parent_id === parentId);

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar */}
      <div className="w-64 glass-panel p-4 overflow-y-auto hidden lg:flex flex-col">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4 px-2">TechForge Vault</h3>
        
        <div className="space-y-1 flex-1">
          <button 
            onClick={() => setSelectedFolder(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedFolder ? 'bg-sentinel-teal/20 text-sentinel-teal font-semibold' : 'text-text-secondary hover:bg-glass-bg hover:text-white'
            }`}
          >
            <Folder size={16} />
            <span>All Files</span>
          </button>

          {rootFolders.map(folder => (
            <FolderTreeItem key={folder.id} folder={folder} selectedFolder={selectedFolder} onSelect={setSelectedFolder} getChildren={getChildren} />
          ))}
        </div>

        {isAdmin && (
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
                <button type="submit" className="w-full py-2 bg-sentinel-teal text-white rounded-lg text-xs font-bold">Create Folder</button>
              </form>
            ) : (
              <button onClick={() => setShowNewFolder(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sentinel-teal hover:bg-sentinel-teal/10 transition-colors font-medium">
                <FolderPlus size={16} />
                <span>New Folder</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between glass-panel p-4 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-secondary">Vault</span>
            <ChevronRight size={14} className="text-text-secondary" />
            <span className="font-semibold text-sentinel-teal">{selectedFolder ? selectedFolder.name : 'All Files'}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Custom Field (Tags) Input */}
            <div className="flex items-center gap-2 bg-white/5 border border-glass-border rounded-lg px-2">
              <TagIcon size={14} className="text-text-secondary" />
              <input 
                placeholder="Add Tag..." 
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAddTag(e)}
                className="bg-transparent border-none text-xs text-white py-1.5 focus:ring-0 w-24"
              />
              <button onClick={handleAddTag} className="p-1 hover:text-sentinel-teal text-text-secondary"><Plus size={14} /></button>
            </div>

            <select value={classification} onChange={e => setClassification(e.target.value)} className="text-xs bg-white/5 border border-glass-border rounded-lg px-2 py-1.5 text-white">
              <option value="Internal">Internal</option>
              <option value="Confidential">Confidential</option>
              <option value="Restricted">Restricted</option>
              <option value="Top Secret">Top Secret</option>
            </select>

            {isAdmin && (
              <>
                <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="px-4 py-1.5 bg-sentinel-teal hover:bg-sentinel-teal/80 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-2 disabled:opacity-50">
                  {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={14} />}
                  {uploading ? 'ENCRYPTING...' : 'UPLOAD ASSET'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Current Tags Display during upload */}
        {currentTags.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1">
            {currentTags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-sentinel-teal/10 text-sentinel-teal border border-sentinel-teal/20 rounded-full text-[10px] font-bold">
                {tag} <button onClick={() => handleRemoveTag(tag)}><X size={10} /></button>
              </span>
            ))}
          </div>
        )}

        {uploadSuccess && (
          <div className={`p-3 rounded-lg text-sm font-medium ${uploadSuccess.startsWith('✅') ? 'bg-safe-green/20 text-safe-green border border-safe-green/30' : 'bg-alert-red/20 text-alert-red border border-alert-red/30'}`}>
            {uploadSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-1 custom-scrollbar">
          {files.map(file => (
            <FileCard key={file.id} file={file} onClick={() => onFileSelect(file)} onDownload={handleDownload} onDelete={handleDelete} isAdmin={isAdmin} />
          ))}
        </div>
      </div>
    </div>
  );
};

const FolderTreeItem = ({ folder, selectedFolder, onSelect, getChildren }) => {
  const isActive = selectedFolder?.id === folder.id;
  const children = getChildren(folder.id);

  return (
    <div>
      <button
        onClick={() => onSelect(folder)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive ? 'bg-sentinel-teal/20 text-sentinel-teal font-semibold' : 'text-text-secondary hover:bg-glass-bg hover:text-white'
        }`}
      >
        {isActive ? <FolderOpen size={16} /> : <Folder size={16} />}
        <span className="truncate">{folder.name}</span>
      </button>
      {children.length > 0 && (
        <div className="ml-4 space-y-1 mt-1 border-l border-glass-border pl-2">
          {children.map(child => (
            <FolderTreeItem key={child.id} folder={child} selectedFolder={selectedFolder} onSelect={onSelect} getChildren={getChildren} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileCard = ({ file, onClick, onDownload, onDelete, isAdmin }) => {
  const tags = JSON.parse(file.tags || '[]');
  const isTopSecret = file.classification === 'Top Secret';
  const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(1)} KB`;

  return (
    <div onClick={onClick} className={`glass-panel p-4 hover:border-sentinel-teal/50 transition-all group flex flex-col cursor-pointer ${isTopSecret ? 'border-alert-red/30' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl transition-colors ${isTopSecret ? 'bg-alert-red/10' : 'bg-glass-bg group-hover:bg-sentinel-teal/10'}`}>
          {isTopSecret ? <Lock size={20} className="text-alert-red" /> : <File size={20} className="text-text-secondary group-hover:text-sentinel-teal transition-colors" />}
        </div>
        {isAdmin && (
          <button onClick={(e) => onDelete(file, e)} className="p-1.5 hover:bg-alert-red/20 rounded-lg text-text-secondary hover:text-alert-red transition-colors opacity-0 group-hover:opacity-100" title="Delete Permanent">
            <Trash2 size={16} />
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <div className="font-bold text-sm mb-1 truncate font-mono">{file.original_name}</div>
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-widest font-black ${isTopSecret ? 'bg-alert-red/20 text-alert-red' : 'bg-midnight-blue text-text-secondary border border-glass-border'}`}>
            {file.classification}
          </span>
          {tags.map(tag => (
            <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-white/5 text-sentinel-teal border border-sentinel-teal/30 rounded-sm font-bold truncate max-w-[80px]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-glass-border flex items-center justify-between">
        <div className="text-[10px] text-text-secondary font-medium">{sizeStr}</div>
        <button onClick={(e) => onDownload(file, e)} className="p-2 bg-sentinel-teal/10 hover:bg-sentinel-teal text-sentinel-teal hover:text-white rounded-lg transition-all" title="Secure Download">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};

export default FileExplorer;
