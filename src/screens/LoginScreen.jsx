import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, Mail, UserPlus, LogIn } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API = '/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? `${API}/auth/register` : `${API}/auth/login`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      localStorage.setItem('sentinel_token', data.token);
      localStorage.setItem('sentinel_user', JSON.stringify(data.user));
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-sentinel-teal/20 rounded-2xl">
              <Shield size={32} className="text-sentinel-teal" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">SENTINEL Vault</h1>
          <p className="text-text-secondary text-sm mt-2">TechForge Solutions — IP Protection System</p>
        </div>

        {/* Form */}
        <div className="glass-panel p-8">
          <h2 className="text-xl font-bold mb-6 text-center">
            {isRegister ? 'Create Account' : 'Sign In'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-alert-red/20 border border-alert-red/40 rounded-lg text-sm text-alert-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@techforge.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-glass-border rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-sentinel-teal transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-glass-border rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-sentinel-teal transition-colors"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sentinel-teal hover:bg-sentinel-teal/80 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isRegister ? (
                <><UserPlus size={18} /> Create Account</>
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-sm text-sentinel-teal hover:underline"
            >
              {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-text-secondary mt-6 uppercase tracking-widest">
          AES-256 Encrypted • JWT Authentication • Real-Time Monitoring
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
