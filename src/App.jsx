import React, { useState } from 'react'
import Layout from './components/Layout'
import ActivityCard from './components/ActivityCard'
import ExecutiveDashboard from './screens/ExecutiveDashboard'
import FileExplorer from './components/FileExplorer'
import FileAccessDetail from './screens/FileAccessDetail'
import MonitoringWall from './screens/MonitoringWall'
import PolicyManagement from './screens/PolicyManagement'

const MOCK_ACTIVITIES = [
  {
    user: 'John Doe',
    action: 'Opened',
    fileName: 'Product Roadmap.pptx',
    time: '2 minutes ago',
    location: 'New York, US',
    riskScore: 12,
    riskLevel: 'low'
  },
  {
    user: 'Sarah Smith',
    action: 'Downloaded',
    fileName: 'Q3_Financial_Projections.xlsx',
    time: '15 minutes ago',
    location: 'London, UK',
    riskScore: 45,
    riskLevel: 'medium'
  },
  {
    user: 'Unknown User',
    action: 'Access Denied',
    fileName: 'Core_Logic_V2.bin',
    time: '1 hour ago',
    location: 'Shanghai, CN',
    riskScore: 88,
    riskLevel: 'high'
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setActiveTab('detail');
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'explorer':
        return <FileExplorer onFileSelect={handleFileSelect} />;
      case 'policy':
        return <PolicyManagement />;
      case 'detail':
        return selectedFile ? (
          <FileAccessDetail file={selectedFile} onBack={() => setActiveTab('explorer')} />
        ) : (
          <FileExplorer onFileSelect={handleFileSelect} />
        );
      case 'activity':
        return <MonitoringWall />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={(tab) => {
      setActiveTab(tab);
      if (tab !== 'detail') setSelectedFile(null);
    }}>
      <div className="space-y-8 h-full">
        {renderContent()}
        
        {/* Persistent Activity Stream for Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Recent Activities</h3>
              <button 
                onClick={() => setActiveTab('activity')}
                className="text-sm text-sentinel-teal hover:underline font-medium"
              >
                View All Activity
              </button>
            </div>
            <div className="grid gap-3">
              {MOCK_ACTIVITIES.map((activity, idx) => (
                <ActivityCard key={idx} activity={activity} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default App
