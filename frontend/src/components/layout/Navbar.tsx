import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Shield,
  BookOpen,
  ChevronDown,
  Check,
  LogOut,
  RefreshCw,
  Atom,
  Layers,
} from 'lucide-react';
import { RoleEnum } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    setUserRole,
    logout,
    isBackendConnected,
    isSyncing,
    refreshBackendData,
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <header className="app-header">
      {/* Left: Squared Classes Static Brand & Scope */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 14px rgba(99, 102, 241, 0.4)',
          }}
        >
          <GraduationCap size={22} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              Squared Classes
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                padding: '1px 7px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                fontWeight: 700,
                border: '1px solid rgba(99, 102, 241, 0.25)',
              }}
            >
              Classes 8 to 12
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>PCM Only (11 & 12)</span>
            <span>•</span>
            <span>All Subjects (8 to 10)</span>
          </div>
        </div>
      </div>

      {/* Right: Engine Status, Role Pill, & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Backend API Connection Status */}
        <button
          onClick={() => refreshBackendData()}
          title="Click to re-check backend connection"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            background: isBackendConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${isBackendConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            fontSize: '0.74rem',
            color: isBackendConnected ? '#34d399' : '#fbbf24',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: isBackendConnected ? '#10b981' : '#f59e0b',
              boxShadow: `0 0 8px ${isBackendConnected ? '#10b981' : '#f59e0b'}`,
            }}
          />
          <span>
            {isSyncing
              ? 'Syncing...'
              : isBackendConnected
              ? 'Live Core (Port 8080)'
              : 'Offline Mode'}
          </span>
        </button>

        {/* Role Switcher Pill */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background:
                currentUser.role_enum === 'ADMIN'
                  ? 'rgba(6, 182, 212, 0.12)'
                  : 'rgba(99, 102, 241, 0.12)',
              border: `1px solid ${
                currentUser.role_enum === 'ADMIN'
                  ? 'rgba(6, 182, 212, 0.3)'
                  : 'rgba(99, 102, 241, 0.3)'
              }`,
              color: currentUser.role_enum === 'ADMIN' ? '#38bdf8' : '#a5b4fc',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {currentUser.role_enum === 'ADMIN' ? <Shield size={14} /> : <BookOpen size={14} />}
            <span>
              {currentUser.role_enum === 'ADMIN' ? 'ADMIN CENTER' : 'FACULTY PORTAL'}
            </span>
            <ChevronDown size={13} />
          </button>

          {showRoleDropdown && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                width: 210,
                zIndex: 50,
                padding: 6,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                Switch Active Portal
              </div>
              <div
                onClick={() => {
                  setUserRole('TEACHER');
                  setShowRoleDropdown(false);
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: currentUser.role_enum === 'TEACHER' ? 'var(--primary)' : 'var(--text-main)',
                  backgroundColor: currentUser.role_enum === 'TEACHER' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                }}
              >
                <span>Faculty / Teacher</span>
                {currentUser.role_enum === 'TEACHER' && <Check size={14} />}
              </div>
              <div
                onClick={() => {
                  setUserRole('ADMIN');
                  setShowRoleDropdown(false);
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: currentUser.role_enum === 'ADMIN' ? '#06b6d4' : 'var(--text-main)',
                  backgroundColor: currentUser.role_enum === 'ADMIN' ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                }}
              >
                <span>Institutional Admin</span>
                {currentUser.role_enum === 'ADMIN' && <Check size={14} />}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Sign Out Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 6, borderLeft: '1px solid var(--border-subtle)' }}>
          <img
            src={currentUser.avatar_url}
            alt={currentUser.name}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--border-subtle)',
            }}
          />
          <div style={{ textAlign: 'left', display: 'none' }} className="user-text-container">
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
              {currentUser.name}
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Sign Out of Squared Classes"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
