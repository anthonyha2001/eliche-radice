'use client';

interface PriorityBadgeProps {
  priority: 'critical' | 'high' | 'normal';
  size?: 'sm' | 'md';
}

export default function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  const config = {
    critical: {
      bg: 'bg-red-600',
      text: 'text-white',
      label: 'Critical',
      icon: '🔴',
      animate: 'animate-pulse',
    },
    high: {
      bg: 'bg-orange-500',
      text: 'text-white',
      label: 'High',
      icon: '🟠',
      animate: '',
    },
    normal: {
      bg: 'bg-green-600',
      text: 'text-white',
      label: 'Normal',
      icon: '🟢',
      animate: '',
    },
  };
  
  const style = config[priority];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';
  
  return (
    <span
      className={`inline-flex items-center space-x-1 rounded-full font-semibold ${style.bg} ${style.text} ${sizeClasses} ${style.animate}`}
      role="status"
      aria-label={`Priority: ${style.label}`}
    >
      <span>{style.icon}</span>
      <span>{style.label}</span>
    </span>
  );
}

