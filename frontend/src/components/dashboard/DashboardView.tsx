import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MetricsOverview } from './MetricsOverview';
import { PipelineVisualizer } from './PipelineVisualizer';
import { RecentBatchesTable } from './RecentBatchesTable';
import { OCRInspectorModal } from '../ingestion/OCRInspectorModal';
import { LayoutDashboard, Sparkles, UploadCloud, BookOpen, FileCheck2 } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { currentInstitute, setActiveTab } = useApp();
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 className="page-title">
            <LayoutDashboard size={28} color="var(--primary)" />
            <span>AI Evaluation Dashboard</span>
          </h1>
          <p className="page-subtitle">
            Welcome, Dr. Radhika Sharma • Monitoring automated OCR extraction and LLM grading for {currentInstitute.name}
          </p>
        </div>

        {/* Action Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('academic')}
          >
            <BookOpen size={14} />
            <span>Rubrics</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('ingestion')}
          >
            <UploadCloud size={14} />
            <span>Upload PDFs</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('evaluation')}
          >
            <FileCheck2 size={14} />
            <span>Review Queue</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <MetricsOverview />

      {/* 7-Stage Architectural Pipeline Tracker */}
      <PipelineVisualizer />

      {/* Recent Batches Table */}
      <RecentBatchesTable onOpenOCRModal={() => setIsOCRModalOpen(true)} />

      {/* OCR Inspector Modal */}
      <OCRInspectorModal
        isOpen={isOCRModalOpen}
        onClose={() => setIsOCRModalOpen(false)}
      />
    </div>
  );
};
