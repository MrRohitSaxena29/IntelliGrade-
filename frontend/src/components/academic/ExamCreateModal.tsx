import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Exam } from '../../types';
import { X, Calendar, BookOpen, Layers } from 'lucide-react';

interface ExamCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamCreateModal: React.FC<ExamCreateModalProps> = ({ isOpen, onClose }) => {
  const { addExam, currentInstitute, setActiveExamId } = useApp();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [totalMarks, setTotalMarks] = useState(50);
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [academicYear, setAcademicYear] = useState('2026-2027');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject) return;

    const newExam: Exam = {
      exam_id: `exam-${Date.now()}`,
      exam_title: title,
      subject,
      total_marks: Number(totalMarks),
      institute_id: currentInstitute.institute_id,
      date,
      academic_year: academicYear,
    };

    addExam(newExam);
    setActiveExamId(newExam.exam_id);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 560 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={20} color="var(--primary)" />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Create New Academic Exam
            </span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
              Exam Title
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Class XII Physics Pre-Board Examination"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Subject / Discipline
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Physics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Total Maximum Marks
              </label>
              <input
                type="number"
                min="10"
                max="200"
                className="form-input"
                value={totalMarks}
                onChange={(e) => setTotalMarks(parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Exam Date
              </label>
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Academic Year
              </label>
              <input
                type="text"
                className="form-input"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <span>Create Exam & Open Rubrics</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
