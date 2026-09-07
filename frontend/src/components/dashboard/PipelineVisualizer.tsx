import React, { useState } from 'react';
import {
  UploadCloud,
  Layers,
  ScanEye,
  Bot,
  UserCheck,
  FileBadge,
  Share2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PipelineVisualizer: React.FC = () => {
  const { setActiveTab } = useApp();
  const [selectedStage, setSelectedStage] = useState<number>(3);

  const stages = [
    {
      step: 1,
      name: 'Ingestion Phase',
      subtitle: 'Batch Upload PDFs',
      icon: <UploadCloud size={20} />,
      status: 'COMPLETED',
      tabTarget: 'ingestion' as const,
      details: 'Uploads multi-page student scans via web portal into S3 vault. Initializes BATCH_UPLOADS record in QUEUED status.',
      metric: '3 Batches',
    },
    {
      step: 2,
      name: 'Async Engine',
      subtitle: 'Message Queue (Redis)',
      icon: <Layers size={20} />,
      status: 'ACTIVE',
      tabTarget: 'ingestion' as const,
      details: 'Workers decouple ingestion from GPU compute. Distributes sheets across high-throughput background processing nodes.',
      metric: '0.4s Latency',
    },
    {
      step: 3,
      name: 'CV & OCR Engine',
      subtitle: 'PaddleOCR Extraction',
      icon: <ScanEye size={20} />,
      status: 'ACTIVE',
      tabTarget: 'ingestion' as const,
      details: 'Converts scanned PDFs to 300 DPI images. Executes character segmentation and maps detected words to OCR_BOUNDING_BOXES with confidence scores.',
      metric: '98.4% Confidence',
    },
    {
      step: 4,
      name: 'GenAI Evaluation',
      subtitle: 'LLM Scoring Agent',
      icon: <Bot size={20} />,
      status: 'COMPLETED',
      tabTarget: 'evaluation' as const,
      details: 'Synthesizes exam rubrics, question marking schemes, and extracted student handwritten answers into structured evaluations with key positives and gaps.',
      metric: 'Sub-second eval',
    },
    {
      step: 5,
      name: 'Human-in-the-Loop',
      subtitle: 'Teacher Calibration',
      icon: <UserCheck size={20} />,
      status: 'NEEDS_ACTION',
      tabTarget: 'evaluation' as const,
      details: 'Educators inspect split-view scans, review AI justifications, tweak marks with mandatory audit trail notes, and click "Approve & Mark Verified".',
      metric: '1 Pending Review',
    },
    {
      step: 6,
      name: 'Branded Scorecards',
      subtitle: 'PDF Generation Engine',
      icon: <FileBadge size={20} />,
      status: 'READY',
      tabTarget: 'reports' as const,
      details: 'Combines verified marks, question breakdowns, institute branding logos, and tamper-proof verification QR codes into high-resolution student scorecards.',
      metric: 'Official Seal',
    },
    {
      step: 7,
      name: 'WhatsApp Delivery',
      subtitle: 'Meta Cloud API',
      icon: <Share2 size={20} />,
      status: 'DELIVERING',
      tabTarget: 'whatsapp' as const,
      details: 'Assembles encrypted Meta Cloud API messages to students/parents with direct scorecard links. Tracks real-time SENT, DELIVERED, and READ statuses.',
      metric: 'Instant Parent SMS',
    },
  ];

  const activeStage = stages[selectedStage];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>IntelliGrade End-to-End Evaluation Pipeline</span>
            <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              Live Operational Workflow
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Click any processing phase below to inspect internal metrics or jump to its specialized studio
          </div>
        </div>
      </div>

      {/* Steps Horizontal Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 8,
          marginBottom: 16,
          overflowX: 'auto',
        }}
      >
        {stages.map((stage, idx) => {
          const isSelected = selectedStage === idx;
          return (
            <button
              key={stage.step}
              onClick={() => setSelectedStage(idx)}
              style={{
                padding: '12px 10px',
                borderRadius: 'var(--radius-sm)',
                border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                background: isSelected
                  ? 'linear-gradient(180deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)'
                  : 'rgba(255, 255, 255, 0.02)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                minWidth: 120,
              }}
              className="glass-panel-hover"
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)',
                  color: isSelected ? '#fff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {stage.icon}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#fff' : 'var(--text-main)', lineHeight: 1.2 }}>
                {stage.step}. {stage.name}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                {stage.subtitle}
              </div>
              <div
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: isSelected ? 'var(--secondary)' : 'var(--text-dim)',
                  marginTop: 2,
                }}
              >
                {stage.metric}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Card */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, maxWidth: '80%' }}>
          <div
            style={{
              padding: 8,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--primary)',
            }}
          >
            <Info size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Stage {activeStage.step}: {activeStage.name} ({activeStage.subtitle})
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
              {activeStage.details}
            </div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setActiveTab(activeStage.tabTarget)}
        >
          <span>Open Module</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
