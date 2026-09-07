import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { mockFaculty } from '../../data/mockData';
import { FacultyMember } from '../../types';
import {
  Shield,
  Users,
  Building2,
  BookOpen,
  Send,
  Layers,
  Sparkles,
  Plus,
  History,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Smartphone,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    currentInstitute,
    exams,
    batches,
    results,
    auditLogs,
    whatsAppLogs,
    setActiveTab,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'faculty' | 'batches' | 'whatsapp' | 'audit'>('faculty');
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(mockFaculty);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New faculty form state
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newFacultyEmail, setNewFacultyEmail] = useState('');
  const [newFacultyDept, setNewFacultyDept] = useState<'Physics' | 'Chemistry' | 'Mathematics' | 'Foundation Science' | 'Social Science' | 'English'>('Physics');
  const [newFacultyRole, setNewFacultyRole] = useState('');

  const totalStudents = 184;
  const totalSheetsEvaluated = batches.reduce((acc, b) => acc + b.processed_sheets, 0);
  const totalWhatsAppDelivered = whatsAppLogs.filter(
    (w) => w.delivery_status === 'DELIVERED' || w.delivery_status === 'READ'
  ).length;

  const filteredFaculty = facultyList.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacultyName || !newFacultyEmail) return;

    const isPCM = newFacultyDept === 'Physics' || newFacultyDept === 'Chemistry' || newFacultyDept === 'Mathematics';
    const classesAssigned = isPCM ? ['Class 12', 'Class 11'] : ['Class 10', 'Class 9', 'Class 8'];

    const newFaculty: FacultyMember = {
      faculty_id: `fac-${Date.now()}`,
      name: newFacultyName,
      email: newFacultyEmail,
      department: newFacultyDept,
      classes_assigned: classesAssigned,
      role_title: newFacultyRole || `${newFacultyDept} Faculty`,
      sheets_graded_count: 0,
      accuracy_rate: 100.0,
      avatar_url: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=120&auto=format&fit=crop&q=80`,
      status: 'ACTIVE',
    };

    setFacultyList([newFaculty, ...facultyList]);
    setIsAddModalOpen(false);
    setNewFacultyName('');
    setNewFacultyEmail('');
    setNewFacultyRole('');
  };

  return (
    <div>
      {/* Admin Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 26,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 className="page-title" style={{ margin: 0 }}>
              <Shield size={26} color="#06b6d4" />
              <span>Squared Classes • Admin Center</span>
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#38bdf8',
                fontWeight: 700,
                border: '1px solid rgba(6, 182, 212, 0.3)',
              }}
            >
              Academic Controller Portal
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Institute Oversight • Faculty Management, Class 8–12 Academic Pipelines & Parent Broadcasts
          </p>
        </div>

        {/* Global Admin Action */}
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setIsAddModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <Plus size={15} />
          <span>Register New Faculty</span>
        </button>
      </div>

      {/* Admin KPIs */}
      <div className="grid-metrics" style={{ marginBottom: 28 }}>
        <MetricCard
          title="Total Faculty Members"
          value={facultyList.length}
          subtitle="PCM (11/12) & Foundation (8-10)"
          icon={<Users size={20} />}
          accentColor="#6366f1"
          trend={{ value: '100% active', positive: true }}
        />
        <MetricCard
          title="Enrolled Students (8–12)"
          value={totalStudents}
          subtitle="Classes 8 to 12 Academic Batches"
          icon={<Building2 size={20} />}
          accentColor="#06b6d4"
          badgeText="Active Term"
        />
        <MetricCard
          title="Total Processed Scans"
          value={totalSheetsEvaluated}
          subtitle="PaddleOCR + LLM Scored"
          icon={<Cpu size={20} />}
          accentColor="#10b981"
          trend={{ value: '2 active batches', positive: true }}
        />
        <MetricCard
          title="Parent WhatsApp Reach"
          value={`${totalWhatsAppDelivered}/${whatsAppLogs.length}`}
          subtitle="Verified scorecard deliveries"
          icon={<Send size={20} />}
          accentColor="#f59e0b"
          trend={{ value: '100% reach', positive: true }}
        />
      </div>

      {/* Admin Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 12,
        }}
      >
        {[
          { id: 'faculty', label: 'Faculty Directory & Roles', icon: <Users size={16} /> },
          { id: 'batches', label: 'Class 8–12 Batch Pipeline', icon: <Layers size={16} /> },
          { id: 'whatsapp', label: 'Parent WhatsApp Gateway', icon: <Smartphone size={16} /> },
          { id: 'audit', label: 'Global Compliance Audit', icon: <History size={16} /> },
        ].map((tab) => {
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: isActive ? '#38bdf8' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Faculty Directory */}
      {activeAdminTab === 'faculty' && (
        <div className="glass-panel" style={{ padding: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px' }}>
                Squared Classes Teaching Faculty
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: 0 }}>
                Specialized PCM faculty for Classes 11 & 12 • Core Subject specialists for Classes 8, 9 & 10.
              </p>
            </div>

            {/* Search filter */}
            <div style={{ position: 'relative', width: 260 }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-dim)',
                }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search teacher, subject..."
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Faculty Name & Profile</th>
                  <th>Department</th>
                  <th>Assigned Classes</th>
                  <th>Papers Evaluated</th>
                  <th>Calibration Accuracy</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.map((faculty) => {
                  const isPCM = faculty.department === 'Physics' || faculty.department === 'Chemistry' || faculty.department === 'Mathematics';
                  return (
                    <tr key={faculty.faculty_id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img
                            src={faculty.avatar_url}
                            alt={faculty.name}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid rgba(255, 255, 255, 0.1)',
                            }}
                          />
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                              {faculty.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                              {faculty.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-sm)',
                            background: isPCM ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: isPCM ? '#a5b4fc' : '#34d399',
                          }}
                        >
                          {faculty.department} {isPCM && '(PCM)'}
                        </span>
                      </td>

                      <td>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {faculty.classes_assigned.map((cls) => (
                            <span
                              key={cls}
                              style={{
                                fontSize: '0.72rem',
                                padding: '2px 6px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-muted)',
                              }}
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.85rem' }}>
                        {faculty.sheets_graded_count} sheets
                      </td>

                      <td>
                        <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                          {faculty.accuracy_rate}%
                        </span>
                      </td>

                      <td>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#10b981',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: '#10b981',
                            }}
                          />
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Batch Pipelines */}
      {activeAdminTab === 'batches' && (
        <div className="glass-panel" style={{ padding: 20 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
            Active Scan Batches Across Classes 8–12
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Batch Name</th>
                  <th>Target Exam</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Current Step</th>
                  <th>Upload Time</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((b) => (
                  <tr key={b.upload_id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{b.batch_name}</td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#a5b4fc' }}>
                        Class 12 Physics (PCM)
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={b.batch_status} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 60,
                            height: 6,
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${(b.processed_sheets / b.total_sheets) * 100}%`,
                              height: '100%',
                              backgroundColor: '#06b6d4',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {b.processed_sheets}/{b.total_sheets}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {b.processing_step}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{b.uploaded_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: WhatsApp Gateway */}
      {activeAdminTab === 'whatsapp' && (
        <div className="glass-panel" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px' }}>
                Parent WhatsApp Notification Gateway
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: 0 }}>
                Meta Cloud API phone: {currentInstitute.whatsapp_api_config_json.senderPhoneId} • Template: {currentInstitute.whatsapp_api_config_json.templateNamespace}
              </p>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#10b981',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.1)',
                fontWeight: 700,
              }}
            >
              Webhook Verified
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student & Roll</th>
                  <th>Parent Phone</th>
                  <th>Delivery Status</th>
                  <th>Message Summary</th>
                  <th>Dispatched Time</th>
                </tr>
              </thead>
              <tbody>
                {whatsAppLogs.map((log) => (
                  <tr key={log.delivery_id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {log.student_name} (Roll: {log.roll_number})
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {log.whatsapp_phone_number}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background:
                            log.delivery_status === 'READ'
                              ? 'rgba(6, 182, 212, 0.2)'
                              : log.delivery_status === 'DELIVERED'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : 'rgba(245, 158, 11, 0.2)',
                          color:
                            log.delivery_status === 'READ'
                              ? '#38bdf8'
                              : log.delivery_status === 'DELIVERED'
                              ? '#34d399'
                              : '#fbbf24',
                        }}
                      >
                        {log.delivery_status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                      {log.payload_summary}
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {log.dispatched_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Global Compliance Audit */}
      {activeAdminTab === 'audit' && (
        <div className="glass-panel" style={{ padding: 20 }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
            Squared Classes Institutional Audit Trail
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Faculty Member</th>
                  <th>Action Type</th>
                  <th>Score Change</th>
                  <th>Justification / Reason</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.log_id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {log.log_id}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{log.user_name}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(99, 102, 241, 0.15)',
                          color: '#a5b4fc',
                        }}
                      >
                        {log.change_type}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                      {log.old_marks} → <strong>{log.new_marks}</strong>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{log.reason}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Faculty */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 16,
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: 480,
              width: '100%',
              padding: 24,
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
              Register Teaching Faculty
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 18 }}>
              Add a new instructor to the Squared Classes evaluation and grading pool.
            </p>

            <form onSubmit={handleAddFaculty}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newFacultyName}
                  onChange={(e) => setNewFacultyName(e.target.value)}
                  placeholder="e.g. Dr. Alok Gupta"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={newFacultyEmail}
                  onChange={(e) => setNewFacultyEmail(e.target.value)}
                  placeholder="alok.gupta@squaredclasses.com"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Department / Academic Stream
                </label>
                <select
                  value={newFacultyDept}
                  onChange={(e) => setNewFacultyDept(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: '#1e293b',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                >
                  <option value="Physics">Physics (PCM - Classes 11 & 12)</option>
                  <option value="Chemistry">Chemistry (PCM - Classes 11 & 12)</option>
                  <option value="Mathematics">Mathematics (PCM - Classes 11 & 12)</option>
                  <option value="Foundation Science">Foundation Science (Classes 8–10)</option>
                  <option value="Social Science">Social Science (Classes 9–10)</option>
                  <option value="English">English (Classes 8–10)</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Role Title
                </label>
                <input
                  type="text"
                  value={newFacultyRole}
                  onChange={(e) => setNewFacultyRole(e.target.value)}
                  placeholder="e.g. Senior Faculty - Kinematics & Mechanics"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
