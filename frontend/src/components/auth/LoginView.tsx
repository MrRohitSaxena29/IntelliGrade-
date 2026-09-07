import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Shield,
  BookOpen,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
  Atom,
  Binary,
  Layers,
} from 'lucide-react';
import { RoleEnum } from '../../types';

export const LoginView: React.FC = () => {
  const { login, isBackendConnected } = useApp();
  const [activePortal, setActivePortal] = useState<RoleEnum>('TEACHER');

  // Form states
  const [email, setEmail] = useState('prof.aris@university.edu');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePortalSwitch = (role: RoleEnum) => {
    setActivePortal(role);
    setErrorMessage(null);
    if (role === 'TEACHER') {
      setEmail('prof.aris@university.edu');
      setPassword('password123');
    } else {
      setEmail('admin@squaredclasses.com');
      setPassword('password123');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login(email, password, activePortal);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: RoleEnum) => {
    setIsLoading(true);
    setErrorMessage(null);
    const demoEmail = role === 'TEACHER' ? 'prof.aris@university.edu' : 'admin@squaredclasses.com';
    try {
      await login(demoEmail, 'password123', role);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Glow Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '15%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 480, width: '100%', zIndex: 10 }}>
        {/* Brand Emblem & Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              color: '#fff',
              boxShadow: '0 0 24px rgba(99, 102, 241, 0.45)',
              marginBottom: 16,
            }}
          >
            <GraduationCap size={36} />
          </div>

          <h1
            style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginBottom: 6,
            }}
          >
            Squared <span style={{ color: '#06b6d4' }}>Classes</span>
          </h1>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: 380, margin: '0 auto' }}>
            IntelliGrade AI Assessment Platform • Academic Evaluation for Classes 8 to 12
          </p>

          {/* Academic Scope Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 12,
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontSize: '0.72rem',
              color: '#a5b4fc',
              fontWeight: 600,
            }}
          >
            <Atom size={13} color="#06b6d4" />
            <span>Class 11–12 PCM Only</span>
            <span style={{ color: 'var(--border-focus)' }}>•</span>
            <Layers size={13} color="#10b981" />
            <span>Class 8–10 All Subjects</span>
          </div>
        </div>

        {/* Main Authentication Card */}
        <div
          className="glass-panel"
          style={{
            padding: '28px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Portal Selector Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 6,
              background: 'rgba(0, 0, 0, 0.25)',
              padding: 4,
              borderRadius: 'var(--radius-md)',
              marginBottom: 24,
            }}
          >
            <button
              type="button"
              onClick={() => handlePortalSwitch('TEACHER')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background:
                  activePortal === 'TEACHER'
                    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                    : 'transparent',
                color: activePortal === 'TEACHER' ? '#fff' : 'var(--text-muted)',
                fontWeight: activePortal === 'TEACHER' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <BookOpen size={16} />
              <span>Teacher Portal</span>
            </button>

            <button
              type="button"
              onClick={() => handlePortalSwitch('ADMIN')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '9px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background:
                  activePortal === 'ADMIN'
                    ? 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)'
                    : 'transparent',
                color: activePortal === 'ADMIN' ? '#fff' : 'var(--text-muted)',
                fontWeight: activePortal === 'ADMIN' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Shield size={16} />
              <span>Admin Portal</span>
            </button>
          </div>

          {/* Portal Subtitle */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              background:
                activePortal === 'TEACHER' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(6, 182, 212, 0.08)',
              border: `1px solid ${
                activePortal === 'TEACHER' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(6, 182, 212, 0.2)'
              }`,
              marginBottom: 20,
              fontSize: '0.78rem',
              color: 'var(--text-main)',
              lineHeight: 1.4,
            }}
          >
            {activePortal === 'TEACHER' ? (
              <span>
                <strong>Faculty Access:</strong> Review evaluated papers, inspect handwriting OCR bounding
                boxes, and calibrate marks for Physics, Chemistry, Mathematics & Foundation classes.
              </span>
            ) : (
              <span>
                <strong>Institute Administration:</strong> Center oversight, manage teaching faculty,
                monitor Class 8–12 batch ingestion pipelines, and review parent WhatsApp scorecard delivery.
              </span>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.8rem',
                marginBottom: 16,
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: 6,
                }}
              >
                Institutional Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-dim)',
                  }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activePortal === 'TEACHER' ? 'prof.aris@university.edu' : 'admin@squaredclasses.com'
                  }
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-dim)',
                  }}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '11px',
                fontSize: '0.88rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span>
                {isLoading
                  ? 'Authenticating...'
                  : activePortal === 'TEACHER'
                  ? 'Sign In to Faculty Portal'
                  : 'Sign In to Admin Center'}
              </span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo 1-Click Login Shortcut */}
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border-subtle)' }}>
            <div
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
                textAlign: 'center',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: 10,
              }}
            >
              Instant Demo Access (1-Click)
            </div>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin(activePortal)}
              disabled={isLoading}
              className="btn btn-secondary"
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Sparkles size={14} color="#06b6d4" />
              <span>
                {activePortal === 'TEACHER'
                  ? '1-Click Demo: Dr. Aris Thorne (Physics PCM)'
                  : '1-Click Demo: Center Director (Admin)'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.72rem',
              color: isBackendConnected ? '#34d399' : '#f59e0b',
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: isBackendConnected ? '#10b981' : '#f59e0b',
                boxShadow: `0 0 6px ${isBackendConnected ? '#10b981' : '#f59e0b'}`,
              }}
            />
            <span>
              {isBackendConnected
                ? 'Connected to Squared Classes Core Backend (Port 8080)'
                : 'Offline Demo Mode Active'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
