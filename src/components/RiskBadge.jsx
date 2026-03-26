import React from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

const RiskBadge = ({ level = 'low', score }) => {
  const configs = {
    low: {
      color: 'text-safe-green',
      bg: 'bg-safe-green/10',
      border: 'border-safe-green/20',
      icon: <ShieldCheck size={14} />,
      label: 'Low Risk'
    },
    medium: {
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      icon: <AlertCircle size={14} />,
      label: 'Medium Risk'
    },
    high: {
      color: 'text-alert-red',
      bg: 'bg-alert-red/10',
      border: 'border-alert-red/20',
      icon: <AlertTriangle size={14} />,
      label: 'High Risk'
    }
  };

  const config = configs[level] || configs.low;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${config.bg} ${config.color} ${config.border} font-medium text-xs`}>
      {config.icon}
      <span>{config.label} {score !== undefined && `(${score})`}</span>
    </div>
  );
};

export default RiskBadge;
