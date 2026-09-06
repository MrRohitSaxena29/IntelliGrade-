import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  accentColor?: string;
  badgeText?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'var(--primary)',
  badgeText,
}) => {
  return (
    <div
      className="glass-panel glass-panel-hover"
      style={{
        padding: '20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '4px',
          height: '100%',
          backgroundColor: accentColor,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor,
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.03em', fontFamily: 'var(--font-sans)' }}>
          {value}
        </span>
        {badgeText && (
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary)',
              border: '1px solid var(--border-focus)',
            }}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        {subtitle && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            {subtitle}
          </span>
        )}
        {trend && (
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: trend.positive ? '#34d399' : '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
