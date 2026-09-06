import React from 'react';
import { BatchStatus, DeliveryStatus } from '../../types';
import { Clock, Cpu, CheckCircle2, Send, Eye, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: BatchStatus | DeliveryStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'QUEUED':
        return {
          className: 'badge badge-queued',
          icon: <Clock size={size === 'sm' ? 12 : 14} />,
          label: 'Queued',
        };
      case 'PROCESSING':
        return {
          className: 'badge badge-processing',
          icon: <Cpu size={size === 'sm' ? 12 : 14} />,
          label: 'Processing OCR/AI',
        };
      case 'AI_GRADED':
        return {
          className: 'badge badge-ai-graded',
          icon: <Cpu size={size === 'sm' ? 12 : 14} />,
          label: 'AI Graded',
        };
      case 'TEACHER_REVIEWED':
        return {
          className: 'badge badge-reviewed',
          icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} />,
          label: 'Verified & Approved',
        };
      case 'PUBLISHED':
        return {
          className: 'badge badge-published',
          icon: <Send size={size === 'sm' ? 12 : 14} />,
          label: 'Published',
        };
      case 'SENT':
        return {
          className: 'badge badge-queued',
          icon: <Send size={size === 'sm' ? 12 : 14} />,
          label: 'Sent to Meta API',
        };
      case 'DELIVERED':
        return {
          className: 'badge badge-ai-graded',
          icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} />,
          label: 'Delivered',
        };
      case 'READ':
        return {
          className: 'badge badge-reviewed',
          icon: <Eye size={size === 'sm' ? 12 : 14} />,
          label: 'Read by Parent',
        };
      case 'FAILED':
        return {
          className: 'badge badge-queued',
          icon: <AlertCircle size={size === 'sm' ? 12 : 14} />,
          label: 'Failed Delivery',
        };
      default:
        return {
          className: 'badge',
          icon: null,
          label: status,
        };
    }
  };

  const { className, icon, label } = getBadgeConfig();

  return (
    <span className={className} style={{ fontSize: size === 'sm' ? '0.7rem' : '0.75rem' }}>
      {icon}
      <span>{label}</span>
    </span>
  );
};
