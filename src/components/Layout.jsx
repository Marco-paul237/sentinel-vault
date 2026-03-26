import React from 'react';
import Logo from './Logo';
import { Shield, Bell, User, Search, Menu, LayoutDashboard, FolderTree, Activity, ShieldCheck, Settings, LogOut } from 'lucide-react';

const Layout = ({ children, activeTab, onTabChange, user, onLogout }) => {
  return (
    <div className="flex h-screen bg-bg-primary text-text-primary overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 glass-panel m-4 mr-0 border-r-0 rounded-r-none">
        <div className="p-6 flex items-center gap-3">
          <Logo className="w-8 h-8" />
          <span className="font-bold text-xl tracking-tight">SENTINEL</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => onTabChange('dashboard')}
          />
          <NavItem 
            icon={<FolderTree size={20} />} 
            label="File Explorer" 
            active={activeTab === 'explorer'} 
            onClick={() => onTabChange('explorer')}
          />
          <NavItem 
            icon={<Activity size={20} />} 
            label="Live Activity" 
            active={activeTab === 'activity'}
            onClick={() => onTabChange('activity')}
          />
          <NavItem 
            icon={<ShieldCheck size={20} />} 
            label="Policy Manager" 
            active={activeTab === 'policy'}
            onClick={() => onTabChange('policy')}
          />
        </nav>
        
        <div className="p-4 border-t border-glass-border">
          <NavItem icon={<Settings size={20} />} label="System Settings" />
          <div className="mt-4 p-4 rounded-lg bg-sentinel-teal/10 border border-sentinel-teal/20">
            <div className="text-xs text-sentinel-teal font-semibold uppercase tracking-wider mb-1">System Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-safe-green animate-pulse"></div>
              <span className="text-sm font-medium">All Systems Nominal</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 glass-panel m-4 mb-2 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden p-2 hover:bg-glass-bg rounded-lg">
              <Menu size={20} />
            </button>
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input 
                type="text" 
                placeholder="Search files, users, or alerts..."
                className="w-full bg-glass-bg border border-glass-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-sentinel-teal text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Risk Gauge (Simplified Version) */}
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-safe-green/10 border border-safe-green/20 rounded-full">
              <Shield size={16} className="text-safe-green" />
              <span className="text-sm font-medium">Risk Level: <span className="text-safe-green">Low (12)</span></span>
            </div>

            <button className="p-2 hover:bg-glass-bg rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-alert-red rounded-full"></span>
            </button>
            
            <div className="h-8 w-px bg-glass-border"></div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold">{user?.email || 'User'}</div>
                <div className="text-xs text-text-secondary">{user?.role || 'user'}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-sentinel-teal/20 border border-sentinel-teal/40 flex items-center justify-center overflow-hidden">
                <User size={24} className="text-sentinel-teal" />
              </div>
              <button onClick={onLogout} className="p-2 hover:bg-alert-red/20 rounded-lg text-text-secondary hover:text-alert-red transition-colors" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pt-0">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-sentinel-teal text-white shadow-lg shadow-sentinel-teal/20' 
        : 'hover:bg-glass-bg text-text-secondary hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export default Layout;
