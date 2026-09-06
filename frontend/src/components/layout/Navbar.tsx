import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Shield, User, ChevronDown, Check, Activity, Bell } from 'lucide-react';
import { RoleEnum } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentInstitute,
    setCurrentInstituteId,
    institutes,
    currentUser,
    setUserRole,
  } = useApp();

  const [showInstituteDropdown, setShowInstituteDropdown] = React.useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = React.useState(false);

  return (
    <header className="app-header">
      {/* Left: Active Institute Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
        <button
          onClick={() => {
            setShowInstituteDropdown(!showInstituteDropdown);
            setShowRoleDropdown(false);
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          className="glass-panel-hover"
        >
          <img
            src={currentInstitute.branding_logo_url}
            alt={currentInstitute.name}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              objectFit: 'cover',
              border: `2px solid ${currentInstitute.primary_color}`,
            }}
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
              {currentInstitute.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
              {currentInstitute.tagline}
            </div>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </button>

        {/* Institute Dropdown */}
        {showInstituteDropdown && (
          <div
            className="glass-panel"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 8,
              width: 340,
              zIndex: 50,
              padding: 8,
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ padding: '6px 10px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Switch Institute Tenant
            </div>
            {institutes.map((inst) => (
              <div
                key={inst.institute_id}
                onClick={() => {
                  setCurrentInstituteId(inst.institute_id);
                  setShowInstituteDropdown(false);
                }}
                style={{
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor:
                    inst.institute_id === currentInstitute.institute_id
                      ? 'rgba(99, 102, 241, 0.15)'
                      : 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    inst.institute_id === currentInstitute.institute_id
                      ? 'rgba(99, 102, 241, 0.15)'
                      : 'transparent')
                }
              >
                <img
                  src={inst.branding_logo_url}
                  alt={inst.name}
                  style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {inst.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    WhatsApp Meta API: Connected
                  </div>
                </div>
                {inst.institute_id === currentInstitute.institute_id && (
                  <Check size={16} color="var(--primary)" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Engine Status & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* System Health Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.75rem',
            color: '#34d399',
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
              animation: 'pulse-glow 2s infinite',
            }}
          />
          <span>PaddleOCR + LLM Agent Ready</span>
        </div>

        {/* User Role Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowInstituteDropdown(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <img
              src={currentUser.avatar_url}
              alt={currentUser.name}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--border-subtle)',
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {currentUser.name}
              </div>
              <div
                style={{
                  fontSize: '0.7rem',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Role: {currentUser.role_enum}
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showRoleDropdown && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                width: 220,
                zIndex: 50,
                padding: 6,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ padding: '6px 10px', fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                SIMULATE ROLE
              </div>
              {(['TEACHER', 'ADMIN', 'EVALUATOR'] as RoleEnum[]).map((role) => (
                <div
                  key={role}
                  onClick={() => {
                    setUserRole(role);
                    setShowRoleDropdown(false);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: currentUser.role_enum === role ? 'var(--primary)' : 'var(--text-main)',
                    backgroundColor:
                      currentUser.role_enum === role ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  }}
                >
                  <span>{role}</span>
                  {currentUser.role_enum === role && <Check size={14} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
