import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SheetViewer } from './SheetViewer';
import { ScoreAdjustment } from './ScoreAdjustment';
import { StatusBadge } from '../common/StatusBadge';
import confetti from 'canvas-confetti';
import {
  FileCheck2,
  CheckCircle,
  Award,
  Share2,
  Users,
  ChevronDown,
  Sparkles,
  Send,
} from 'lucide-react';

export const EvaluationStudio: React.FC = () => {
  const {
    currentResult,
    activeSheetId,
    setActiveSheetId,
    answerSheets,
    updateEvaluationMarks,
    approveResult,
    dispatchWhatsApp,
    setActiveTab,
  } = useApp();

  const [activeQuestionId, setActiveQuestionId] = useState<string>('q-1');
  const [approvedNotification, setApprovedNotification] = useState<boolean>(false);

  if (!currentResult) {
    return (
      <div className="glass-panel" style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No answer sheet currently selected for grading.</p>
      </div>
    );
  }

  const handleApprove = () => {
    approveResult(currentResult.result_id);

    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setApprovedNotification(true);
    setTimeout(() => setApprovedNotification(false), 4000);
  };

  const handleSendWhatsApp = () => {
    dispatchWhatsApp(currentResult.result_id);
    setActiveTab('whatsapp');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 124px)', gap: 16 }}>
      {/* Studio Top Control Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Left: Student Selector & Roll */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileCheck2 size={22} color="var(--primary)" />
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Human-in-the-Loop Studio
            </span>
          </div>

          {/* Student Sheet Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Sheet:
            </span>
            <select
              className="form-select"
              style={{ width: 220, padding: '6px 10px', fontSize: '0.8rem' }}
              value={activeSheetId}
              onChange={(e) => setActiveSheetId(e.target.value)}
            >
              {answerSheets.map((s) => (
                <option key={s.sheet_id} value={s.sheet_id}>
                  Roll #{s.extracted_student_roll} ({s.status})
                </option>
              ))}
            </select>
          </div>

          <StatusBadge status={currentResult.status} />
        </div>

        {/* Right: Score Summary & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Final Score Counter */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Score:</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
              {currentResult.final_score}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              / {currentResult.total_marks} ({currentResult.percentage}%)
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#34d399',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
              }}
            >
              Grade {currentResult.grade_letter}
            </span>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('reports')}
            title="Preview student branded scorecard"
          >
            <Award size={14} />
            <span>Scorecard</span>
          </button>

          {currentResult.status === 'TEACHER_REVIEWED' ? (
            <button
              className="btn btn-emerald btn-sm"
              onClick={handleSendWhatsApp}
              title="Deliver to parent on WhatsApp"
            >
              <Send size={14} />
              <span>Send WhatsApp</span>
            </button>
          ) : (
            <button
              className="btn btn-emerald btn-sm"
              onClick={handleApprove}
              title="Approve paper and lock marks"
            >
              <CheckCircle size={14} />
              <span>Approve & Verify</span>
            </button>
          )}
        </div>
      </div>

      {approvedNotification && (
        <div
          style={{
            padding: '10px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'modal-enter 0.2s ease',
          }}
        >
          <span>
            ✓ Answer booklet verified! Teacher approval stamped and score locked for branded report generation.
          </span>
          <button
            className="btn btn-secondary btn-sm"
            style={{ padding: '2px 8px', fontSize: '0.75rem' }}
            onClick={() => setActiveTab('reports')}
          >
            View Official Scorecard →
          </button>
        </div>
      )}

      {/* Split Workspace Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 16, flex: 1, minHeight: 0 }}>
        {/* Left: Scanned Sheet Viewer */}
        <SheetViewer
          studentName={currentResult.student_id === 'stu-101' ? 'Aarav Saxena' : 'Ananya Verma'}
          rollNumber={currentResult.student_id === 'stu-101' ? '12044' : '12045'}
          activeQuestionId={activeQuestionId}
        />

        {/* Right: AI Evaluation & Teacher Calibration */}
        <ScoreAdjustment
          result={currentResult}
          activeQuestionId={activeQuestionId}
          setActiveQuestionId={setActiveQuestionId}
          onUpdateMarks={(itemId, marks, reason) =>
            updateEvaluationMarks(currentResult.result_id, itemId, marks, reason)
          }
        />
      </div>
    </div>
  );
};
