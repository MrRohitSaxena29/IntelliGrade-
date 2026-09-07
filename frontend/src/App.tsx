import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { ExamList } from './components/academic/ExamList';
import { BatchUploadZone } from './components/ingestion/BatchUploadZone';
import { EvaluationStudio } from './components/evaluation/EvaluationStudio';
import { ScorecardPreview } from './components/reports/ScorecardPreview';
import { WhatsAppTracker } from './components/distribution/WhatsAppTracker';
import { AuditLogsTable } from './components/audit/AuditLogsTable';
import { LoginView } from './components/auth/LoginView';

const MainContent: React.FC = () => {
  const { activeTab, isAuthenticated, currentUser } = useApp();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return currentUser.role_enum === 'ADMIN' ? <AdminDashboard /> : <TeacherDashboard />;
      case 'academic':
        return <ExamList />;
      case 'ingestion':
        return <BatchUploadZone />;
      case 'evaluation':
        return <EvaluationStudio />;
      case 'reports':
        return <ScorecardPreview />;
      case 'whatsapp':
        return <WhatsAppTracker />;
      case 'audit':
        return <AuditLogsTable />;
      default:
        return currentUser.role_enum === 'ADMIN' ? <AdminDashboard /> : <TeacherDashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <main className="app-content">{renderTab()}</main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
