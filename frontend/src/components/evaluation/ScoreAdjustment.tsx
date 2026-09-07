import React, { useState } from 'react';
import { Result, EvaluationItem, Question } from '../../types';
import { mockQuestions, mockRubrics } from '../../data/mockData';
import { Bot, CheckCircle2, AlertTriangle, Edit3, ShieldAlert, Sparkles, Scale, MessageSquare } from 'lucide-react';

interface ScoreAdjustmentProps {
  result: Result;
  activeQuestionId: string;
  setActiveQuestionId: (qId: string) => void;
  onUpdateMarks: (evalItemId: string, newMarks: number, reason: string) => void;
}

export const ScoreAdjustment: React.FC<ScoreAdjustmentProps> = ({
  result,
  activeQuestionId,
  setActiveQuestionId,
  onUpdateMarks,
}) => {
  const currentItem =
    result.evaluation_items.find((item) => item.question_id === activeQuestionId) ||
    result.evaluation_items[0];

  const currentQuestion =
    mockQuestions.find((q) => q.question_id === activeQuestionId) || mockQuestions[0];
  const questionRubrics = mockRubrics.filter((r) => r.question_id === activeQuestionId);

  const currentMarks =
    currentItem?.teacher_marks !== undefined ? currentItem.teacher_marks : currentItem?.marks_awarded || 0;

  const [overrideMarks, setOverrideMarks] = useState<number>(currentMarks);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [showOverrideFeedback, setShowOverrideFeedback] = useState<boolean>(false);

  // Sync state when active question changes
  React.useEffect(() => {
    if (currentItem) {
      setOverrideMarks(
        currentItem.teacher_marks !== undefined ? currentItem.teacher_marks : currentItem.marks_awarded
      );
      setOverrideReason(currentItem.teacher_notes || '');
    }
  }, [activeQuestionId, currentItem]);

  const handleSaveOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    onUpdateMarks(
      currentItem.eval_item_id,
      Number(overrideMarks),
      overrideReason || 'Calibrated based on handwritten method verification'
    );
    setShowOverrideFeedback(true);
    setTimeout(() => setShowOverrideFeedback(false), 3000);
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Question Selector Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.25)',
          overflowX: 'auto',
        }}
      >
        {mockQuestions.map((q) => {
          const isSelected = q.question_id === activeQuestionId;
          const evalItem = result.evaluation_items.find((it) => it.question_id === q.question_id);
          const score =
            evalItem?.teacher_marks !== undefined ? evalItem.teacher_marks : evalItem?.marks_awarded || 0;

          return (
            <button
              key={q.question_id}
              onClick={() => setActiveQuestionId(q.question_id)}
              style={{
                flex: 1,
                minWidth: 110,
                padding: '12px 14px',
                background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: 'none',
                borderBottom: isSelected ? '2px solid var(--primary)' : '2px solid transparent',
                color: isSelected ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                Question {q.question_number}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: evalItem?.is_overridden ? '#f59e0b' : '#38bdf8',
                  fontWeight: 600,
                }}
              >
                {score} / {q.max_marks} pts {evalItem?.is_overridden ? '✎' : ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Review Body */}
      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Question Statement & Rubrics Reference */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Exam Question Statement
            </span>
            <span className="code-tag">Max: {currentQuestion.max_marks} Marks</span>
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.4 }}>
            {currentQuestion.question_text}
          </div>
        </div>

        {/* Rubric Breakdown Accordion */}
        <div style={{ padding: '12px', background: 'rgba(0, 0, 0, 0.25)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Scale size={14} />
            <span>Marking Scheme Rubric Reference</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {questionRubrics.map((r, i) => (
              <div key={r.rubric_id} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700, minWidth: 40 }}>
                  +{r.weightage_points}m:
                </span>
                <span>{r.criteria_text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GenAI Evaluation Card */}
        {currentItem && (
          <div
            className="glass-panel"
            style={{
              padding: '16px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.04) 100%)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Bot size={18} color="#c084fc" />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc' }}>
                  AI Evaluation Justification
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>AI Score:</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                  {currentItem.marks_awarded} / {currentItem.max_marks}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 12 }}>
              {currentItem.ai_justification}
            </p>

            {/* Positives */}
            {currentItem.key_positives.length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', marginBottom: 4 }}>
                  Verified Strengths & Derivations
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {currentItem.key_positives.map((pos, idx) => (
                    <div key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <CheckCircle2 size={13} color="#34d399" style={{ minWidth: 13, marginTop: 2 }} />
                      <span>{pos}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gaps */}
            {currentItem.key_gaps.length > 0 && (
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', marginBottom: 4 }}>
                  Identified Gaps / Deduction Criteria
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {currentItem.key_gaps.map((gap, idx) => (
                    <div key={idx} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <AlertTriangle size={13} color="#fbbf24" style={{ minWidth: 13, marginTop: 2 }} />
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Human-in-the-Loop Teacher Override Controller */}
        <div style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Edit3 size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Teacher Calibration & Override
              </span>
            </div>
            {currentItem?.is_overridden && (
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', fontWeight: 700 }}>
                Manually Calibrated
              </span>
            )}
          </div>

          <form onSubmit={handleSaveOverride}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 14, alignItems: 'center', marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  Final Awarded Marks (0 to {currentQuestion.max_marks})
                </label>
                <input
                  type="range"
                  min="0"
                  max={currentQuestion.max_marks}
                  step="0.5"
                  value={overrideMarks}
                  onChange={(e) => setOverrideMarks(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>

              <div>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max={currentQuestion.max_marks}
                  value={overrideMarks}
                  onChange={(e) => setOverrideMarks(parseFloat(e.target.value))}
                  className="form-input"
                  style={{ textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                <ShieldAlert size={12} color="var(--text-dim)" />
                <span>Audit Trail Rationale (Logged into AUDIT_LOGS table)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Student used alternate cross-product method; awarded full marks"
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Overrides update student percentage instantly
              </span>

              <button type="submit" className="btn btn-primary btn-sm">
                <span>Save Override & Log Audit</span>
              </button>
            </div>

            {showOverrideFeedback && (
              <div style={{ marginTop: 10, fontSize: '0.75rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} />
                <span>Score updated and recorded into institutional audit trail!</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
