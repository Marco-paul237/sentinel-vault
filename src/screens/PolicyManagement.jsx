import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle } from 'lucide-react';

const API = '/api';

const PolicyManagement = ({ token }) => {
  const [policies, setPolicies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', condition_field: 'risk_score', condition_operator: '>', condition_value: '80', action: 'block_download', severity: 'high' });

  useEffect(() => {
    fetchPolicies();
  }, [token]);

  const fetchPolicies = async () => {
    try {
      const res = await fetch(`${API}/policies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setPolicies(await res.json());
    } catch (err) {
      console.error('Failed to fetch policies', err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/policies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        fetchPolicies();
        setShowForm(false);
        setForm({ name: '', description: '', condition_field: 'risk_score', condition_operator: '>', condition_value: '80', action: 'block_download', severity: 'high' });
      }
    } catch (err) {
      console.error('Failed to create policy', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this policy?')) return;
    try {
      const res = await fetch(`${API}/policies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchPolicies();
    } catch (err) {
      console.error('Failed to delete policy', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3"><Shield className="text-sentinel-teal" /> Policy Manager</h2>
          <p className="text-sm text-text-secondary mt-1">Define security rules that control file access and trigger alerts</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-sentinel-teal hover:bg-sentinel-teal/80 text-white rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> New Policy
        </button>
      </div>

      {/* Create Policy Form */}
      {showForm && (
        <form onSubmit={handleCreate} className="glass-panel p-6 space-y-4 border border-sentinel-teal/30">
          <h3 className="font-bold text-lg">Create New Policy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1 block">Policy Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g., Block Bulk Downloads" className="w-full px-3 py-2 bg-white/5 border border-glass-border rounded-lg text-white placeholder-text-secondary focus:border-sentinel-teal" />
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1 block">Description</label>
              <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What does this policy do?" className="w-full px-3 py-2 bg-white/5 border border-glass-border rounded-lg text-white placeholder-text-secondary focus:border-sentinel-teal" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1 block">Condition</label>
              <select value={form.condition_field} onChange={e => setForm({...form, condition_field: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-glass-border rounded-lg text-white">
                <option value="risk_score">Risk Score</option>
                <option value="download_count">Download Count</option>
                <option value="access_time">Access Time</option>
                <option value="classification">File Classification</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1 block">Operator</label>
              <select value={form.condition_operator} onChange={e => setForm({...form, condition_operator: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-glass-border rounded-lg text-white">
                <option value=">">Greater than</option>
                <option value="<">Less than</option>
                <option value="==">Equals</option>
                <option value="!=">Not equals</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1 block">Value</label>
              <input value={form.condition_value} onChange={e => setForm({...form, condition_value: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-glass-border rounded-lg text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1 block">Action</label>
              <select value={form.action} onChange={e => setForm({...form, action: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-glass-border rounded-lg text-white">
                <option value="block_download">Block Download</option>
                <option value="revoke_session">Revoke Session Token</option>
                <option value="alert_admin">Alert Admin</option>
                <option value="lock_file">Lock File</option>
                <option value="send_email">Send Email Notification</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1 block">Severity</label>
              <select value={form.severity} onChange={e => setForm({...form, severity: e.target.value})} className="w-full px-3 py-2 bg-white/5 border border-glass-border rounded-lg text-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 bg-sentinel-teal hover:bg-sentinel-teal/80 text-white rounded-lg font-bold text-sm">Create Policy</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-lg font-bold text-sm">Cancel</button>
          </div>
        </form>
      )}

      {/* Policies List */}
      {policies.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <Shield size={48} className="mx-auto text-text-secondary mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">No policies defined</h3>
          <p className="text-sm text-text-secondary">Create your first security policy to start enforcing rules on file access.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {policies.map(policy => (
            <div key={policy.id} className="glass-panel p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${policy.severity === 'critical' || policy.severity === 'high' ? 'bg-alert-red/20 text-alert-red' : 'bg-sentinel-teal/20 text-sentinel-teal'}`}>
                  {policy.severity === 'critical' || policy.severity === 'high' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                </div>
                <div>
                  <div className="font-bold">{policy.name}</div>
                  <div className="text-xs text-text-secondary mt-0.5">{policy.description || 'No description'}</div>
                  <div className="text-[10px] text-text-secondary mt-1 font-mono">
                    IF {policy.condition_field} {policy.condition_operator} {policy.condition_value} → {policy.action?.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                  policy.severity === 'critical' ? 'bg-alert-red text-white' : 
                  policy.severity === 'high' ? 'bg-orange-500/20 text-orange-400' : 
                  policy.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-safe-green/20 text-safe-green'
                }`}>
                  {policy.severity}
                </span>
                <button onClick={() => handleDelete(policy.id)} className="p-2 hover:bg-alert-red/20 rounded-lg text-text-secondary hover:text-alert-red transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PolicyManagement;
