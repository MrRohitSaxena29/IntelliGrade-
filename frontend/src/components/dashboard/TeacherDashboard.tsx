import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import {
  BookOpen,
  FileCheck2,
  Clock,
  Send,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  FileText,
  Atom,
  Binary,
  Layers,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const {
    currentUser,
    answerSheets,
    results,
    exams,
    setActiveSheetId,
    setActiveTab,
    auditLogs,
    whatsAppLogs,
  } = useApp();

  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('ALL');

  // Filter sheets by selected grade
  const filteredSheets = answerSheets.filter((sheet) => {
    if (selectedGradeFilter === 'ALL') return true;
    const exam = exams.find((e) => e.exam_id === sheet.batch_upload_id || e.exam_id === 'exam-101');
    if (!exam?.grade_level) return true;
    return exam.grade_level === selectedGradeFilter;
  });

  const pendingReviewCount = results.filter((r) => r.status === 'AI_GRADED').length;
  const verifiedCount = results.filter((r) => r.status === 'TEACHER_REVIEWED' || r.status === 'PUBLISHED').length;

  return (
    <div>
      {/* Teacher Welcome Banner */}
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
              <span>Faculty Evaluation Studio</span>
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#a5b4fc',
                fontWeight: 700,
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            >
              Squared Classes • Faculty Workspace
            </span>
          </div>
          <p className="page-subtitle" style={{ margin: 0 }}>
            Welcome, {currentUser.name} • Class 11–12 PCM & Foundation Academic Evaluation Pipeline
          </p>
        </div>

        {/* Quick Teacher Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('academic')}
          >
            <BookOpen size={14} />
            <span>Class Rubrics</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('ingestion')}
          >
            <FileText size={14} />
            <span>Upload Scan Batch</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('evaluation')}
          >
            <FileCheck2 size={14} />
            <span>Review Active Queue ({pendingReviewCount})</span>
          </button>
        </div>
      </div>

      {/* Teacher KPI Cards */}
      <div className="grid-metrics" style={{ marginBottom: 28 }}>
        <MetricCard
          title="Pending Human Reviews"
          value={pendingReviewCount}
          subtitle="Awaiting teacher verification"
          icon={<Clock size={20} />}
          accentColor="#f59e0b"
          trend={{ value: 'Ready for calibration', positive: false }}
        />
        <MetricCard
          title="AI Evaluation Accuracy"
          value="99.1%"
          subtitle="PaddleOCR & Step Rubric Matching"
          icon={<BrainCircuit size={20} />}
          accentColor="#06b6d4"
          badgeText="Vision 2.4 Model"
        />
        <MetricCard
          title="Papers Approved & Finalized"
          value={verifiedCount}
          subtitle="Calibrated and approved by faculty"
          icon={<CheckCircle2 size={20} />}
          accentColor="#10b981"
          trend={{ value: '100% audited', positive: true }}
        />
        <MetricCard
          title="Parent WhatsApp Dispatches"
          value={whatsAppLogs.length}
          subtitle="Meta Cloud API scorecards sent"
          icon={<Send size={20} />}
          accentColor="#6366f1"
          trend={{ value: 'Real-time receipts', positive: true }}
        />
      </div>

      {/* Class Level Filters */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Filter Evaluation Queue by Grade:
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Classes (8–12)' },
            { id: 'Class 12', label: 'Class 12 (PCM)' },
            { id: 'Class 11', label: 'Class 11 (PCM)' },
            { id: 'Class 10', label: 'Class 10 (All Core)' },
            { id: 'Class 9', label: 'Class 9 (All Core)' },
            { id: 'Class 8', label: 'Class 8 (All Core)' },
          ].map((grade) => {
            const isSelected = selectedGradeFilter === grade.id;
            return (
              <button
                key={grade.id}
                onClick={() => setSelectedGradeFilter(grade.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {grade.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Review Queue Table */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 28 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px' }}>
              Handwritten Answer Sheets in Queue
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', margin: 0 }}>
              Click 'Open Evaluation Studio' to inspect OCR bounding boxes and adjust marks against CBSE rubrics.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Student / Roll No</th>
                <th>Class & Subject</th>
                <th>OCR Status</th>
                <th>Awarded Score</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSheets.map((sheet) => {
                const result = results.find((r) => r.sheet_id === sheet.sheet_id);
                const isPhysicsPCM = sheet.sheet_id === 'sheet-101';
                return (
                  <tr key={sheet.sheet_id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'rgba(99, 102, 241, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                          }}
                        >
                          #{sheet.extracted_student_roll}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            {sheet.extracted_student_roll === '12044'
                              ? 'Aarav Saxena'
                              : `Student #${sheet.extracted_student_roll}`}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            Roll: {sheet.extracted_student_roll}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            color: '#a5b4fc',
                            display: 'inline-block',
                            marginRight: 6,
                          }}
                        >
                          {isPhysicsPCM ? 'Class 12 (PCM)' : 'Class 11 (PCM)'}
                        </span>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {isPhysicsPCM ? 'Physics (Electrodynamics)' : 'Mathematics (Calculus)'}
                        </div>
                      </div>
                    </td>

                    <td>
                      <StatusBadge status={sheet.status} />
                    </td>

                    <td style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                      {result ? `${result.final_score} / ${result.total_marks}` : '—'}
                    </td>

                    <td>
                      {result ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div
                            style={{
                              width: 50,
                              height: 6,
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: 'rgba(255, 255, 255, 0.08)',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${result.percentage}%`,
                                height: '100%',
                                backgroundColor:
                                  result.percentage >= 80
                                    ? '#10b981'
                                    : result.percentage >= 60
                                    ? '#f59e0b'
                                    : '#ef4444',
                              }}
                            />
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            {result.percentage}%
                          </span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td>
                      {result?.grade_letter ? (
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            color: 'var(--primary)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(99, 102, 241, 0.1)',
                          }}
                        >
                          {result.grade_letter}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                        onClick={() => {
                          setActiveSheetId(sheet.sheet_id);
                          setActiveTab('evaluation');
                        }}
                      >
                        <span>Open Evaluation Studio</span>
                        <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Personal Teacher Calibrations */}
      <div className="glass-panel" style={{ padding: 20 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 12 }}>
          Recent Mark Calibrations & Audit Trail (My Sessions)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {auditLogs.slice(0, 3).map((log) => (
            <div
              key={log.log_id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#a5b4fc',
                    fontWeight: 700,
                    marginRight: 8,
                  }}
                >
                  {log.change_type}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {log.reason}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Score: {log.old_marks} → <strong>{log.new_marks}</strong> ({log.timestamp})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
