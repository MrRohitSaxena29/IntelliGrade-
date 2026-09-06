import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Institute,
  User,
  Exam,
  BatchUpload,
  AnswerSheet,
  Result,
  AuditLog,
  WhatsAppDeliveryLog,
  RoleEnum,
  BatchStatus,
} from '../types';
import {
  mockInstitutes,
  mockCurrentUser,
  mockExams,
  mockBatches,
  mockAnswerSheets,
  mockResults,
  mockAuditLogs,
  mockWhatsAppLogs,
} from '../data/mockData';

export type NavigationTab =
  | 'dashboard'
  | 'academic'
  | 'ingestion'
  | 'evaluation'
  | 'reports'
  | 'whatsapp'
  | 'audit';

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentInstitute: Institute;
  setCurrentInstituteId: (id: string) => void;
  institutes: Institute[];
  currentUser: User;
  setUserRole: (role: RoleEnum) => void;
  exams: Exam[];
  activeExamId: string;
  setActiveExamId: (id: string) => void;
  addExam: (exam: Exam) => void;
  batches: BatchUpload[];
  addBatch: (batch: BatchUpload) => void;
  answerSheets: AnswerSheet[];
  activeSheetId: string;
  setActiveSheetId: (sheetId: string) => void;
  results: Result[];
  currentResult: Result | undefined;
  updateEvaluationMarks: (
    resultId: string,
    evalItemId: string,
    newMarks: number,
    reason: string
  ) => void;
  approveResult: (resultId: string) => void;
  auditLogs: AuditLog[];
  whatsAppLogs: WhatsAppDeliveryLog[];
  dispatchWhatsApp: (resultId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [institutes] = useState<Institute[]>(mockInstitutes);
  const [currentInstituteId, setCurrentInstituteId] = useState<string>('inst-1');
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [activeExamId, setActiveExamId] = useState<string>('exam-101');
  const [batches, setBatches] = useState<BatchUpload[]>(mockBatches);
  const [answerSheets, setAnswerSheets] = useState<AnswerSheet[]>(mockAnswerSheets);
  const [activeSheetId, setActiveSheetId] = useState<string>('sheet-101');
  const [results, setResults] = useState<Result[]>(mockResults);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [whatsAppLogs, setWhatsAppLogs] = useState<WhatsAppDeliveryLog[]>(mockWhatsAppLogs);

  const currentInstitute =
    institutes.find((inst) => inst.institute_id === currentInstituteId) || institutes[0];

  const currentResult = results.find((r) => r.sheet_id === activeSheetId);

  // Update Institute primary and accent CSS variables dynamically
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', currentInstitute.primary_color);
    document.documentElement.style.setProperty('--secondary', currentInstitute.accent_color);
  }, [currentInstitute]);

  const setUserRole = (role: RoleEnum) => {
    setCurrentUser((prev) => ({ ...prev, role_enum: role }));
  };

  const addExam = (newExam: Exam) => {
    setExams((prev) => [newExam, ...prev]);
  };

  const addBatch = (newBatch: BatchUpload) => {
    setBatches((prev) => [newBatch, ...prev]);
    // Simulate auto-progression through pipeline
    setTimeout(() => {
      setBatches((prev) =>
        prev.map((b) =>
          b.upload_id === newBatch.upload_id
            ? {
                ...b,
                batch_status: 'PROCESSING' as BatchStatus,
                processing_step: 'PaddleOCR extracting text & bounding boxes...',
                processed_sheets: Math.floor(newBatch.total_sheets * 0.5),
              }
            : b
        )
      );
    }, 2500);

    setTimeout(() => {
      setBatches((prev) =>
        prev.map((b) =>
          b.upload_id === newBatch.upload_id
            ? {
                ...b,
                batch_status: 'AI_GRADED' as BatchStatus,
                processing_step: 'LLM Evaluator completed. Ready for Teacher Review.',
                processed_sheets: newBatch.total_sheets,
              }
            : b
        )
      );
    }, 6000);
  };

  const updateEvaluationMarks = (
    resultId: string,
    evalItemId: string,
    newMarks: number,
    reason: string
  ) => {
    setResults((prevResults) =>
      prevResults.map((res) => {
        if (res.result_id !== resultId) return res;

        let diff = 0;
        const updatedItems = res.evaluation_items.map((item) => {
          if (item.eval_item_id === evalItemId) {
            const oldMarks = item.teacher_marks !== undefined ? item.teacher_marks : item.marks_awarded;
            diff = newMarks - oldMarks;

            // Add Audit Log
            const newAuditEntry: AuditLog = {
              log_id: `log-${Date.now()}`,
              result_id: resultId,
              question_id: item.question_id,
              user_id: currentUser.user_id,
              user_name: currentUser.name,
              change_type: 'MARKS_OVERRIDE',
              old_marks: oldMarks,
              new_marks: newMarks,
              reason: reason || 'Teacher manual calibration based on rubric review',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            };
            setAuditLogs((prevLogs) => [newAuditEntry, ...prevLogs]);

            return {
              ...item,
              teacher_marks: newMarks,
              teacher_notes: reason,
              is_overridden: true,
            };
          }
          return item;
        });

        const newFinalScore = Math.min(res.total_marks, Math.max(0, res.final_score + diff));
        const newPercentage = Math.round((newFinalScore / res.total_marks) * 100);

        return {
          ...res,
          final_score: newFinalScore,
          percentage: newPercentage,
          evaluation_items: updatedItems,
        };
      })
    );
  };

  const approveResult = (resultId: string) => {
    setResults((prev) =>
      prev.map((r) =>
        r.result_id === resultId
          ? {
              ...r,
              status: 'TEACHER_REVIEWED' as BatchStatus,
              approved_by_user_id: currentUser.user_id,
              approved_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
            }
          : r
      )
    );

    setAnswerSheets((prev) =>
      prev.map((s) => (s.sheet_id === activeSheetId ? { ...s, status: 'TEACHER_REVIEWED' } : s))
    );

    // Audit log
    const approveLog: AuditLog = {
      log_id: `log-app-${Date.now()}`,
      result_id: resultId,
      question_id: 'ALL',
      user_id: currentUser.user_id,
      user_name: currentUser.name,
      change_type: 'STATUS_APPROVE',
      old_marks: currentResult?.final_score || 0,
      new_marks: currentResult?.final_score || 0,
      reason: 'Teacher approved paper after rubric verification and justification review.',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAuditLogs((prev) => [approveLog, ...prev]);
  };

  const dispatchWhatsApp = (resultId: string) => {
    const res = results.find((r) => r.result_id === resultId);
    if (!res) return;

    // Mark result published
    setResults((prev) =>
      prev.map((r) => (r.result_id === resultId ? { ...r, status: 'PUBLISHED' as BatchStatus } : r))
    );

    // Add or update WhatsApp log
    const newLog: WhatsAppDeliveryLog = {
      delivery_id: `wa-${Date.now()}`,
      result_id: resultId,
      student_id: res.student_id,
      student_name: res.student_id === 'stu-101' ? 'Aarav Saxena' : 'Student',
      roll_number: res.student_id === 'stu-101' ? '12044' : '12045',
      whatsapp_phone_number: '+91 98765 43210',
      message_id_external: `wamid.${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      delivery_status: 'SENT',
      dispatched_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      payload_summary: `Official Grade Card: ${res.final_score}/${res.total_marks} (${res.percentage}%). Feedback: ${res.overall_feedback.substring(0, 70)}...`,
    };

    setWhatsAppLogs((prev) => [newLog, ...prev]);

    // Simulate delivery update after 2s
    setTimeout(() => {
      setWhatsAppLogs((prev) =>
        prev.map((l) =>
          l.delivery_id === newLog.delivery_id
            ? {
                ...l,
                delivery_status: 'DELIVERED',
                delivered_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
              }
            : l
        )
      );
    }, 2500);

    // Simulate read receipt after 5s
    setTimeout(() => {
      setWhatsAppLogs((prev) =>
        prev.map((l) =>
          l.delivery_id === newLog.delivery_id
            ? {
                ...l,
                delivery_status: 'READ',
                read_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
              }
            : l
        )
      );
    }, 5500);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentInstitute,
        setCurrentInstituteId,
        institutes,
        currentUser,
        setUserRole,
        exams,
        activeExamId,
        setActiveExamId,
        addExam,
        batches,
        addBatch,
        answerSheets,
        activeSheetId,
        setActiveSheetId,
        results,
        currentResult,
        updateEvaluationMarks,
        approveResult,
        auditLogs,
        whatsAppLogs,
        dispatchWhatsApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
