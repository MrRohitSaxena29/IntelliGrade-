import React from 'react';
import { useApp, NavigationTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  UploadCloud,
  FileCheck2,
  Award,
  MessageSquareShare,
  History,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, results } = useApp();

  const pendingReviewCount = results.filter((r) => r.status === 'AI_GRADED').length;

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Overview',
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: 'academic',
      label: 'Exams & Rubrics',
      icon: <BookOpen size={18} />,
    },
    {
      id: 'ingestion',
      label: 'Batch Ingestion & OCR',
      icon: <UploadCloud size={18} />,
    },
    {
      id: 'evaluation',
      label: 'Evaluation Studio',
      icon: <FileCheck2 size={18} />,
      badge: pendingReviewCount,
    },
    {
      id: 'reports',
      label: 'Branded Scorecards',
      icon: <Award size={18} />,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp Delivery',
      icon: <MessageSquareShare size={18} />,
    },
    {
      id: 'audit',
      label: 'Audit Trail & Logs',
      icon: <History size={18} />,
    },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)',
          }}
        >
          <GraduationCap size={24} />
        </div>
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
            Intelli<span style={{ color: 'var(--secondary)' }}>Grade</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            AI Evaluation v2.4
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '0 8px 6px' }}>
          Platform Modules
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid transparent',
                background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)' : 'transparent',
                borderColor: isActive ? 'var(--border-focus)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              className="glass-panel-hover"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: isActive ? 'var(--primary)' : 'var(--text-dim)' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '1px 7px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 0 10px var(--primary-glow)',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Assistant Banner */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
        <div
          className="glass-panel"
          style={{
            padding: '12px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Sparkles size={16} color="var(--secondary)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
              LLM Rubric Engine
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Evaluating handwriting scans against strict marks rubrics with 98.4% OCR precision.
          </p>
        </div>
      </div>
    </aside>
  );
};
