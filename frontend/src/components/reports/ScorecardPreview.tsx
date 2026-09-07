import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockQuestions } from '../../data/mockData';
import { Printer, Download, Send, CheckCircle2, ShieldCheck, QrCode, Award } from 'lucide-react';

export const ScorecardPreview: React.FC = () => {
  const { currentResult, currentInstitute, exams, dispatchWhatsApp, setActiveTab } = useApp();

  if (!currentResult) {
    return (
      <div className="glass-panel" style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No student result available to preview.</p>
      </div>
    );
  }

  const exam = exams.find((e) => e.exam_id === currentResult.exam_id) || exams[0];
  const isAarav = currentResult.student_id === 'stu-101';
  const studentName = isAarav ? 'Aarav Saxena' : 'Ananya Verma';
  const rollNumber = isAarav ? '12044' : '12045';
  const gradeSection = isAarav ? 'Grade 12 - Section A' : 'Grade 12 - Section A';

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    dispatchWhatsApp(currentResult.result_id);
    setActiveTab('whatsapp');
  };

  return (
    <div>
      {/* Action Header */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <div>
          <h2 className="page-title">
            <Award size={26} color="var(--primary)" />
            <span>Official Branded Student Scorecard</span>
          </h2>
          <p className="page-subtitle">
            Tamper-proof academic performance report formatted for institutional delivery
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print / Save PDF</span>
          </button>

          <button className="btn btn-primary" onClick={handleSendWhatsApp}>
            <Send size={16} />
            <span>Dispatch to Parent WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Printable Scorecard Container */}
      <div
        className="printable-card"
        style={{
          maxWidth: 860,
          margin: '0 auto',
          background: '#ffffff',
          color: '#0f172a',
          borderRadius: 'var(--radius-md)',
          padding: '40px 48px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
          position: 'relative',
        }}
      >
        {/* Top Institute Branding Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `3px solid ${currentInstitute.primary_color}`,
            paddingBottom: 20,
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img
              src={currentInstitute.branding_logo_url}
              alt={currentInstitute.name}
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `2px solid ${currentInstitute.primary_color}`,
              }}
            />
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                {currentInstitute.name}
              </h1>
              <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500, marginTop: 2 }}>
                {currentInstitute.tagline}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                Official Automated Assessment Record • CBSE Registered Center
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#f0fdf4',
                color: '#166534',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px solid #bbf7d0',
              }}
            >
              <ShieldCheck size={14} />
              <span>AI & Teacher Verified</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 6 }}>
              Date: {exam.date}
            </div>
          </div>
        </div>

        {/* Student & Exam Info Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-sm)',
            padding: '16px 20px',
            marginBottom: 24,
            fontSize: '0.85rem',
          }}
        >
          <div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Student Name
            </span>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{studentName}</strong>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Roll Number
            </span>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
              {rollNumber}
            </strong>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Class & Section
            </span>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{gradeSection}</strong>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              Examination
            </span>
            <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{exam.subject}</strong>
          </div>
        </div>

        {/* Big Score Summary Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 28,
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#c7d2fe', fontWeight: 600 }}>
              Total Performance Score
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              {currentResult.final_score} <span style={{ fontSize: '1.2rem', color: '#a5b4fc' }}>/ {currentResult.total_marks}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.8rem', color: '#c7d2fe', textTransform: 'uppercase', fontWeight: 600 }}>
              Aggregate Percentage
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8' }}>
              {currentResult.percentage}%
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: '#c7d2fe', textTransform: 'uppercase', fontWeight: 600 }}>
              Grade Awarded
            </div>
            <div
              style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#4ade80',
                background: 'rgba(74, 222, 128, 0.15)',
                padding: '4px 18px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                display: 'inline-block',
                marginTop: 4,
              }}
            >
              {currentResult.grade_letter}
            </div>
          </div>
        </div>

        {/* Question-wise Breakdown Table */}
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Question-Wise Assessment Breakdown
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#334155', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Q#</th>
                <th style={{ padding: '10px 12px' }}>Evaluated Syllabus Competency</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Max Marks</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Marks Awarded</th>
                <th style={{ padding: '10px 12px' }}>Pedagogical Feedback</th>
              </tr>
            </thead>
            <tbody>
              {currentResult.evaluation_items.map((item) => {
                const q = mockQuestions.find((mq) => mq.question_id === item.question_id);
                const marks = item.teacher_marks !== undefined ? item.teacher_marks : item.marks_awarded;

                return (
                  <tr key={item.eval_item_id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>
                      Q{q?.question_number || '1'}
                    </td>
                    <td style={{ padding: '12px', color: '#334155', maxWidth: 260 }}>
                      <div style={{ fontWeight: 600 }}>{q?.question_text.substring(0, 75)}...</div>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}>
                      {item.max_marks}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: '#1e3a8a' }}>
                      {marks}
                    </td>
                    <td style={{ padding: '12px', color: '#475569', fontSize: '0.8rem' }}>
                      {item.key_positives[0] || item.ai_justification.substring(0, 80)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Overall Qualitative Feedback */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-sm)', padding: '16px 20px', marginBottom: 28 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', marginBottom: 6 }}>
            Overall Evaluator Feedback & Remarks
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
            "{currentResult.overall_feedback}"
          </p>
        </div>

        {/* Signature & Verification Seal Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderTop: '1px solid #e2e8f0',
            paddingTop: 20,
          }}
        >
          {/* QR Code Verification */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 58,
                height: 58,
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
              }}
            >
              <QrCode size={40} color="#334155" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a' }}>
                Scan to Verify Authenticity
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                ID: {currentResult.result_id}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                https://intelligrade.edu/v/{rollNumber}
              </div>
            </div>
          </div>

          {/* Teacher Signature Box */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Caveat, cursive, serif', fontSize: '1.4rem', color: '#1e3a8a', fontStyle: 'italic', marginBottom: 2 }}>
              Dr. Radhika Sharma
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
              Head of Department / Senior Evaluator
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              Stampted & Approved on {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
