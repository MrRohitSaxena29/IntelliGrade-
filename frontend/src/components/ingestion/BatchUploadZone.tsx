import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BatchUpload } from '../../types';
import { OCRInspectorModal } from './OCRInspectorModal';
import { RecentBatchesTable } from '../dashboard/RecentBatchesTable';
import { UploadCloud, FileText, CheckCircle2, ArrowRight, Layers, Cpu, Sparkles } from 'lucide-react';

export const BatchUploadZone: React.FC = () => {
  const { exams, activeExamId, setActiveExamId, addBatch, currentUser, currentInstitute } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);

  const selectedExam = exams.find((e) => e.exam_id === activeExamId) || exams[0];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleStartIngestion = () => {
    if (!selectedFile && !uploadSuccess) {
      // Create mock file if not selected
    }

    setIsUploading(true);

    setTimeout(() => {
      const fileName = selectedFile ? selectedFile.name : `Scans_${selectedExam?.subject || 'Physics'}_Batch.zip`;
      const sheetCount = Math.floor(Math.random() * 20) + 15;

      const newBatch: BatchUpload = {
        upload_id: `batch-${Date.now()}`,
        exam_id: selectedExam?.exam_id || 'exam-101',
        user_id: currentUser.user_id,
        batch_name: fileName,
        batch_status: 'QUEUED',
        s3_archive_url: `s3://intelligrade-vault/${currentInstitute.institute_id}/${fileName}`,
        total_sheets: sheetCount,
        processed_sheets: 0,
        uploaded_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
        processing_step: 'Queued for Asynchronous Engine (Redis worker pool)...',
      };

      addBatch(newBatch);
      setIsUploading(false);
      setUploadSuccess(true);
      setSelectedFile(null);

      setTimeout(() => setUploadSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 className="page-title">
          <UploadCloud size={26} color="var(--primary)" />
          <span>Batch PDF Ingestion & OCR Pipeline</span>
        </h2>
        <p className="page-subtitle">
          Upload bulk scanned answer booklets. IntelliGrade automatically extracts handwriting coordinates and prepares LLM evaluation.
        </p>
      </div>

      {/* Target Exam Selection & Upload Zone */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24 }}>
          {/* Exam Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 8 }}>
              Select Examination Target
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {exams.map((ex) => (
                <div
                  key={ex.exam_id}
                  onClick={() => setActiveExamId(ex.exam_id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: ex.exam_id === selectedExam?.exam_id ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    background: ex.exam_id === selectedExam?.exam_id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: ex.exam_id === selectedExam?.exam_id ? '#fff' : 'var(--text-main)' }}>
                    {ex.exam_title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {ex.subject} • {ex.total_marks} Marks
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline Stage Indicators */}
            <div style={{ marginTop: 20, padding: 14, background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Cpu size={14} color="var(--secondary)" />
                <span>Async Engine Specs</span>
              </div>
              <ul style={{ fontSize: '0.72rem', color: 'var(--text-dim)', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>✓ Max throughput: 120 pages/min</li>
                <li>✓ PaddleOCR character segmentation</li>
                <li>✓ Automated roll number extraction</li>
                <li>✓ Redis MQ worker pool active</li>
              </ul>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                border: isDragging ? '2px dashed var(--primary)' : '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '40px 24px',
                textAlign: 'center',
                background: isDragging ? 'rgba(99, 102, 241, 0.08)' : 'rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <UploadCloud size={28} />
              </div>

              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>
                {selectedFile ? selectedFile.name : 'Drag & Drop Scanned Answer Sheets (.PDF, .ZIP)'}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 420, marginBottom: 18 }}>
                Upload batches containing single or multi-page student answer scans. PaddleOCR will detect question numbers, handwritten lines, and bounding boxes.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  <span>Browse Local Files</span>
                  <input
                    type="file"
                    accept=".pdf,.zip,.tar.gz"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleStartIngestion}
                  disabled={isUploading}
                >
                  <Sparkles size={14} />
                  <span>{isUploading ? 'Ingesting Scans to Vault...' : 'Process Demo Ingestion Batch'}</span>
                </button>
              </div>

              {uploadSuccess && (
                <div
                  style={{
                    marginTop: 16,
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Batch queued successfully! PaddleOCR workers have started processing.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Batches Table & OCR inspector button */}
      <RecentBatchesTable onOpenOCRModal={() => setIsOCRModalOpen(true)} />

      {/* OCR Inspector Modal */}
      <OCRInspectorModal isOpen={isOCRModalOpen} onClose={() => setIsOCRModalOpen(false)} />
    </div>
  );
};
