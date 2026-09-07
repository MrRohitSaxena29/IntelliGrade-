import React, { useState } from 'react';
import { Question, Rubric } from '../../types';
import { mockQuestions, mockRubrics } from '../../data/mockData';
import { Plus, Trash2, CheckCircle, Sparkles, Scale } from 'lucide-react';

interface RubricEditorProps {
  examId: string;
}

export const RubricEditor: React.FC<RubricEditorProps> = ({ examId }) => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [rubrics, setRubrics] = useState<Rubric[]>(mockRubrics);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('q-1');
  const [newCriteriaText, setNewCriteriaText] = useState<string>('');
  const [newWeightage, setNewWeightage] = useState<number>(1.0);
  const [newAiPrompt, setNewAiPrompt] = useState<string>('');

  const activeQuestion = questions.find((q) => q.question_id === selectedQuestionId) || questions[0];
  const activeRubrics = rubrics.filter((r) => r.question_id === selectedQuestionId);

  const currentTotalRubricMarks = activeRubrics.reduce((sum, r) => sum + r.weightage_points, 0);

  const handleAddCriteria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCriteriaText.trim()) return;

    const newRubric: Rubric = {
      rubric_id: `rub-${Date.now()}`,
      question_id: selectedQuestionId,
      criteria_text: newCriteriaText,
      weightage_points: Number(newWeightage),
      ai_grading_prompt: newAiPrompt || 'Verify step accuracy against expected standard answer.',
    };

    setRubrics((prev) => [...prev, newRubric]);
    setNewCriteriaText('');
    setNewAiPrompt('');
  };

  const handleDeleteRubric = (rubricId: string) => {
    setRubrics((prev) => prev.filter((r) => r.rubric_id !== rubricId));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
      {/* Left: Questions Column */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Questions Scheme</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            {questions.length} Items
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {questions.map((q) => {
            const isSelected = q.question_id === selectedQuestionId;
            const qRubrics = rubrics.filter((r) => r.question_id === q.question_id);
            const rubricsWeight = qRubrics.reduce((s, r) => s + r.weightage_points, 0);

            return (
              <div
                key={q.question_id}
                onClick={() => setSelectedQuestionId(q.question_id)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isSelected ? '#fff' : 'var(--text-main)' }}>
                    Question {q.question_number}
                  </span>
                  <span className="code-tag">{q.max_marks} Marks</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.3, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {q.question_text}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  <span>{qRubrics.length} Criteria</span>
                  <span style={{ color: rubricsWeight === q.max_marks ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                    Rubrics: {rubricsWeight}/{q.max_marks} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Rubric Rules & Criteria for Active Question */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Question {activeQuestion.question_number} Rubric Criteria
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Total Allocated:
              </span>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: currentTotalRubricMarks === activeQuestion.max_marks ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: currentTotalRubricMarks === activeQuestion.max_marks ? '#34d399' : '#fbbf24',
                  border: `1px solid ${currentTotalRubricMarks === activeQuestion.max_marks ? '#10b981' : '#f59e0b'}`,
                }}
              >
                {currentTotalRubricMarks} / {activeQuestion.max_marks} Marks
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.4 }}>
            {activeQuestion.question_text}
          </p>
        </div>

        {/* Existing Rubric Criteria */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Scale size={14} />
            <span>Defined AI Scoring Criteria</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {activeRubrics.map((r, index) => (
              <div
                key={r.rubric_id}
                style={{
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 16,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 8px', borderRadius: 4 }}>
                      Step {index + 1}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>
                      +{r.weightage_points} Marks
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {r.criteria_text}
                  </div>
                  {r.ai_grading_prompt && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6, fontStyle: 'italic' }}>
                      <Sparkles size={12} color="var(--secondary)" />
                      <span>AI Prompt: "{r.ai_grading_prompt}"</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteRubric(r.rubric_id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: 4,
                  }}
                  title="Remove Criteria"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Criteria Form */}
        <form onSubmit={handleAddCriteria} style={{ padding: '16px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-subtle)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} color="var(--primary)" />
            <span>Add Step-Wise Rubric Criteria</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                Criteria Statement (What the student must derive or explain)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. State conditions for equilibrium and show summation of torques = 0"
                value={newCriteriaText}
                onChange={(e) => setNewCriteriaText(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                Marks Weight
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max={activeQuestion.max_marks}
                className="form-input"
                value={newWeightage}
                onChange={(e) => setNewWeightage(parseFloat(e.target.value))}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
              LLM Semantic Prompt Instruction (Optional guidance for the AI evaluator)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Accept both algebraic and vector cross-product methods"
              value={newAiPrompt}
              onChange={(e) => setNewAiPrompt(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            <Plus size={14} />
            <span>Append Rubric Rule</span>
          </button>
        </form>
      </div>
    </div>
  );
};
