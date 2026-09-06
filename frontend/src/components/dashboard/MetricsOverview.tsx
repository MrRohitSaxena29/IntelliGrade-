import React from 'react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { Files, CheckCircle, Clock, Send, BrainCircuit, Users } from 'lucide-react';

export const MetricsOverview: React.FC = () => {
  const { batches, results, whatsAppLogs, answerSheets } = useApp();

  const totalSheets = batches.reduce((acc, b) => acc + b.total_sheets, 0);
  const totalGraded = results.length;
  const pendingReview = results.filter((r) => r.status === 'AI_GRADED').length;
  const totalWhatsAppDelivered = whatsAppLogs.filter(
    (w) => w.delivery_status === 'DELIVERED' || w.delivery_status === 'READ'
  ).length;

  return (
    <div className="grid-metrics">
      <MetricCard
        title="Total Ingested Sheets"
        value={totalSheets}
        subtitle={`${answerSheets.length} active in current queue`}
        icon={<Files size={20} />}
        accentColor="#6366f1"
        trend={{ value: '18% this week', positive: true }}
      />
      <MetricCard
        title="AI Evaluation Accuracy"
        value="98.4%"
        subtitle="PaddleOCR + LLM Rubric Cross-Check"
        icon={<BrainCircuit size={20} />}
        accentColor="#06b6d4"
        badgeText="Model: Vision 2.4"
      />
      <MetricCard
        title="Teacher Reviews Pending"
        value={pendingReview}
        subtitle="Human-in-the-loop validation queue"
        icon={<Clock size={20} />}
        accentColor="#f59e0b"
        trend={{ value: 'Ready for override', positive: false }}
      />
      <MetricCard
        title="WhatsApp Scorecards Sent"
        value={`${totalWhatsAppDelivered}/${whatsAppLogs.length}`}
        subtitle="Meta Cloud API verified delivery"
        icon={<Send size={20} />}
        accentColor="#10b981"
        trend={{ value: '100% reach', positive: true }}
      />
    </div>
  );
};
