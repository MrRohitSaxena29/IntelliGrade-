import React from 'react';
import { useApp } from '../../context/AppContext';
import { History, ShieldCheck, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export const AuditLogsTable: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 className="page-title">
          <History size={26} color="var(--primary)" />
          <span>Institutional Audit Trail & Verification Logs</span>
        </h2>
        <p className="page-subtitle">
          Complete, tamper-evident log of teacher mark adjustments, justifications, and approvals for accreditation compliance
        </p>
      </div>

      {/* Audit Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={18} color="#34d399" />
            <span>Recorded Calibration Events ({auditLogs.length})</span>
          </div>

          <span
            style={{
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontWeight: 600,
            }}
          >
            CBSE / State Board Audit Ready
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Timestamp</th>
                <th style={{ padding: '10px 14px' }}>Log ID</th>
                <th style={{ padding: '10px 14px' }}>Event Type</th>
                <th style={{ padding: '10px 14px' }}>Authorized Evaluator</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Score Calibration</th>
                <th style={{ padding: '10px 14px' }}>Educator Justification Rationale</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => {
                const diff = log.new_marks - log.old_marks;
                return (
                  <tr
                    key={log.log_id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                  >
                    <td style={{ padding: '14px', color: 'var(--text-dim)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {log.timestamp}
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span className="code-tag">{log.log_id}</span>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          background:
                            log.change_type === 'MARKS_OVERRIDE'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(16, 185, 129, 0.15)',
                          color: log.change_type === 'MARKS_OVERRIDE' ? '#fbbf24' : '#34d399',
                          border: `1px solid ${
                            log.change_type === 'MARKS_OVERRIDE'
                              ? 'rgba(245, 158, 11, 0.3)'
                              : 'rgba(16, 185, 129, 0.3)'
                          }`,
                        }}
                      >
                        {log.change_type}
                      </span>
                    </td>

                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{log.user_name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>ID: {log.user_id}</div>
                    </td>

                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      {log.change_type === 'MARKS_OVERRIDE' ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)' }}>
                          <span style={{ color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                            {log.old_marks}m
                          </span>
                          <ArrowRight size={12} color="var(--primary)" />
                          <span style={{ fontWeight: 800, color: '#34d399' }}>
                            {log.new_marks}m
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              color: diff > 0 ? '#34d399' : '#f87171',
                            }}
                          >
                            ({diff > 0 ? `+${diff}` : diff})
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>Final Approval</span>
                      )}
                    </td>

                    <td style={{ padding: '14px', color: 'var(--text-muted)', maxWidth: 360, lineHeight: 1.4 }}>
                      "{log.reason}"
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
