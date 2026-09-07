import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { FolderArchive, Eye, ArrowUpRight, Cpu } from 'lucide-react';

export const RecentBatchesTable: React.FC<{ onOpenOCRModal?: () => void }> = ({
  onOpenOCRModal,
}) => {
  const { batches, exams, setActiveTab } = useApp();

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderArchive size={18} color="var(--primary)" />
            <span>Active Exam Ingestion Batches</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Monitored pipeline batches processed by PaddleOCR and LLM Rubric Engines
          </div>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveTab('ingestion')}
        >
          <span>Batch Upload PDFs</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px 14px' }}>Batch Archive</th>
              <th style={{ padding: '10px 14px' }}>Linked Exam</th>
              <th style={{ padding: '10px 14px' }}>Status</th>
              <th style={{ padding: '10px 14px' }}>Processing Progress</th>
              <th style={{ padding: '10px 14px' }}>Uploaded At</th>
              <th style={{ padding: '10px 14px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((b) => {
              const exam = exams.find((e) => e.exam_id === b.exam_id);
              const progressPct = Math.round((b.processed_sheets / b.total_sheets) * 100);

              return (
                <tr
                  key={b.upload_id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{b.batch_name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      {b.s3_archive_url}
                    </div>
                  </td>

                  <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                    {exam ? exam.exam_title : 'Physics Mid-Term'}
                  </td>

                  <td style={{ padding: '14px' }}>
                    <StatusBadge status={b.batch_status} />
                  </td>

                  <td style={{ padding: '14px', minWidth: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {b.processed_sheets} / {b.total_sheets} Sheets
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{progressPct}%</span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${progressPct}%`,
                          background:
                            progressPct === 100
                              ? 'linear-gradient(90deg, #10b981, #059669)'
                              : 'linear-gradient(90deg, #6366f1, #06b6d4)',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                    {b.processing_step && (
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b.processing_step}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '14px', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                    {b.uploaded_at}
                  </td>

                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                      {onOpenOCRModal && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={onOpenOCRModal}
                          title="Inspect OCR Bounding Boxes"
                        >
                          <Cpu size={14} />
                          <span>OCR Boxes</span>
                        </button>
                      )}

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setActiveTab('evaluation')}
                      >
                        <Eye size={14} />
                        <span>Grading Studio</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
