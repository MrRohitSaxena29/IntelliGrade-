import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { WhatsAppDeliveryLog } from '../../types';
import {
  MessageSquareShare,
  Send,
  CheckCheck,
  Check,
  Smartphone,
  Eye,
  X,
  Share2,
  ExternalLink,
} from 'lucide-react';

export const WhatsAppTracker: React.FC = () => {
  const { whatsAppLogs, currentInstitute } = useApp();
  const [inspectedMessage, setInspectedMessage] = useState<WhatsAppDeliveryLog | null>(null);

  const totalDelivered = whatsAppLogs.filter(
    (l) => l.delivery_status === 'DELIVERED' || l.delivery_status === 'READ'
  ).length;
  const totalRead = whatsAppLogs.filter((l) => l.delivery_status === 'READ').length;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 className="page-title">
          <MessageSquareShare size={26} color="#25D366" />
          <span>Automated WhatsApp Scorecard Distribution</span>
        </h2>
        <p className="page-subtitle">
          Real-time Meta Cloud API webhook delivery monitor for student and parent grade cards
        </p>
      </div>

      {/* API Config Summary Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.08) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '1px solid rgba(37, 211, 102, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#25D366',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Smartphone size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Meta Cloud Business API Connected
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Sender Phone ID: <span className="code-tag">{currentInstitute.whatsapp_api_config_json.senderPhoneId}</span> • Template: <span className="code-tag">{currentInstitute.whatsapp_api_config_json.templateNamespace}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: '0.8rem' }}>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Delivered Rate:</span>
            <strong style={{ color: '#34d399', fontSize: '1rem' }}>
              {Math.round((totalDelivered / whatsAppLogs.length) * 100)}%
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)', display: 'block' }}>Parent Read Rate:</span>
            <strong style={{ color: '#38bdf8', fontSize: '1rem' }}>
              {Math.round((totalRead / whatsAppLogs.length) * 100)}%
            </strong>
          </div>
        </div>
      </div>

      {/* Delivery Logs Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 16 }}>
          Live Outbound Message Dispatches
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 14px' }}>Recipient Student</th>
                <th style={{ padding: '10px 14px' }}>Parent WhatsApp</th>
                <th style={{ padding: '10px 14px' }}>Meta API Status</th>
                <th style={{ padding: '10px 14px' }}>External Message ID</th>
                <th style={{ padding: '10px 14px' }}>Dispatch Timestamp</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {whatsAppLogs.map((log) => (
                <tr
                  key={log.delivery_id}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}
                >
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{log.student_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      Roll: {log.roll_number}
                    </div>
                  </td>

                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {log.whatsapp_phone_number}
                  </td>

                  <td style={{ padding: '14px' }}>
                    <StatusBadge status={log.delivery_status} />
                  </td>

                  <td style={{ padding: '14px' }}>
                    <span className="code-tag">{log.message_id_external.substring(0, 18)}...</span>
                  </td>

                  <td style={{ padding: '14px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                    {log.dispatched_at}
                    {log.read_at && (
                      <div style={{ fontSize: '0.68rem', color: '#38bdf8' }}>
                        Read at: {log.read_at}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setInspectedMessage(log)}
                    >
                      <Eye size={14} />
                      <span>View Message</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated WhatsApp Phone Bubble Modal */}
      {inspectedMessage && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 420, padding: 0, overflow: 'hidden', background: '#0b141a' }}>
            {/* WhatsApp Chat Header */}
            <div
              style={{
                background: '#202c33',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#fff',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src={currentInstitute.branding_logo_url}
                  alt={currentInstitute.name}
                  style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e9edef' }}>
                    {currentInstitute.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#8696a0' }}>
                    Official Verified Business Account
                  </div>
                </div>
              </div>

              <button
                onClick={() => setInspectedMessage(null)}
                style={{ background: 'transparent', border: 'none', color: '#8696a0', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Conversation Area */}
            <div
              style={{
                padding: '24px 16px',
                minHeight: 300,
                backgroundImage: 'radial-gradient(#1f2c34 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              {/* Date divider */}
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: '0.68rem', background: '#182229', color: '#8696a0', padding: '3px 8px', borderRadius: 4 }}>
                  TODAY
                </span>
              </div>

              {/* Message Bubble */}
              <div
                style={{
                  background: '#005c4b',
                  color: '#e9edef',
                  padding: '12px 14px',
                  borderRadius: '8px 8px 0px 8px',
                  maxWidth: '90%',
                  alignSelf: 'flex-end',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                }}
              >
                <div style={{ fontWeight: 700, color: '#25D366', fontSize: '0.78rem', marginBottom: 4 }}>
                  {currentInstitute.name} Examination Board
                </div>

                <p style={{ margin: '0 0 10px 0' }}>
                  {inspectedMessage.payload_summary}
                </p>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '8px 10px',
                    borderRadius: 6,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#8696a0' }}>Official Verified Scorecard</div>
                  <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>
                    https://intelligrade.edu/r/{inspectedMessage.roll_number}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, fontSize: '0.65rem', color: '#8696a0' }}>
                  <span>{inspectedMessage.dispatched_at.split(' ')[1] || '11:22'}</span>
                  {inspectedMessage.delivery_status === 'READ' ? (
                    <CheckCheck size={14} color="#53bdeb" />
                  ) : inspectedMessage.delivery_status === 'DELIVERED' ? (
                    <CheckCheck size={14} color="#8696a0" />
                  ) : (
                    <Check size={14} color="#8696a0" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
