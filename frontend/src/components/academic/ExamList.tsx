import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExamCreateModal } from './ExamCreateModal';
import { RubricEditor } from './RubricEditor';
import { BookOpen, Plus, Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

export const ExamList: React.FC = () => {
  const { exams, activeExamId, setActiveExamId } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedExam = exams.find((e) => e.exam_id === activeExamId) || exams[0];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 className="page-title">
            <BookOpen size={26} color="var(--primary)" />
            <span>Academic Exams & AI Rubrics</span>
          </h2>
          <p className="page-subtitle">
            Configure syllabus questions, maximum marks, and step-wise LLM evaluation rubrics
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>New Examination</span>
        </button>
      </div>

      {/* Exam Selector Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {exams.map((exam) => {
          const isSelected = exam.exam_id === selectedExam?.exam_id;
          return (
            <div
              key={exam.exam_id}
              onClick={() => setActiveExamId(exam.exam_id)}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '18px 20px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)'
                  : 'var(--bg-glass)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="code-tag">{exam.subject}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {exam.total_marks} Marks
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: isSelected ? '#fff' : 'var(--text-main)', marginBottom: 8, lineHeight: 1.3 }}>
                {exam.exam_title}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={12} />
                  {exam.date}
                </span>
                <span>Year: {exam.academic_year}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rubric Definition Workspace */}
      {selectedExam && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Marking Scheme & Rubrics: <span style={{ color: 'var(--secondary)' }}>{selectedExam.exam_title}</span>
            </h3>
          </div>
          <RubricEditor examId={selectedExam.exam_id} />
        </div>
      )}

      {/* Create Modal */}
      <ExamCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
