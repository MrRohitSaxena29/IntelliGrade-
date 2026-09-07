import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  OCRPage,
} from '../types';
import {
  squaredClassesInstitute,
  mockInstitutes,
  mockCurrentUser,
  mockTeacherUser,
  mockAdminUser,
  mockExams,
  mockBatches,
  mockAnswerSheets,
  mockResults,
  mockAuditLogs,
  mockWhatsAppLogs,
  mockOCRPage1,
} from '../data/mockData';
import { api } from '../services/api';
import {
  mapApiExamToExam,
  mapApiBatchToBatchUpload,
  mapApiSheetEvaluationToEntities,
  mapApiAuditLogToAuditLog,
} from '../services/adapters';

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
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: RoleEnum) => Promise<void>;
  logout: () => void;
  exams: Exam[];
  activeExamId: string;
  setActiveExamId: (id: string) => void;
  addExam: (exam: Exam) => Promise<void>;
  batches: BatchUpload[];
  addBatch: (batch: BatchUpload, file?: File | null) => Promise<void>;
  answerSheets: AnswerSheet[];
  activeSheetId: string;
  setActiveSheetId: (sheetId: string) => void;
  results: Result[];
  currentResult: Result | undefined;
  activeOCRPage: OCRPage;
  updateEvaluationMarks: (
    resultId: string,
    evalItemId: string,
    newMarks: number,
    reason: string
  ) => Promise<void>;
  approveResult: (resultId: string) => Promise<void>;
  auditLogs: AuditLog[];
  whatsAppLogs: WhatsAppDeliveryLog[];
  dispatchWhatsApp: (resultId: string) => Promise<void>;
  isBackendConnected: boolean;
  isSyncing: boolean;
  refreshBackendData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('intelligrade_jwt_token');
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [currentInstitute] = useState<Institute>(squaredClassesInstitute);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('intelligrade_user_role');
    return saved === 'ADMIN' ? mockAdminUser : mockTeacherUser;
  });

  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [activeExamId, setActiveExamId] = useState<string>('exam-101');
  const [batches, setBatches] = useState<BatchUpload[]>(mockBatches);
  const [answerSheets, setAnswerSheets] = useState<AnswerSheet[]>(mockAnswerSheets);
  const [activeSheetId, setActiveSheetId] = useState<string>('sheet-101');
  const [results, setResults] = useState<Result[]>(mockResults);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [whatsAppLogs, setWhatsAppLogs] = useState<WhatsAppDeliveryLog[]>(mockWhatsAppLogs);
  const [activeOCRPage, setActiveOCRPage] = useState<OCRPage>(mockOCRPage1);

  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const currentResult = results.find((r) => r.sheet_id === activeSheetId);

  // Set Squared Classes theme CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', currentInstitute.primary_color);
    document.documentElement.style.setProperty('--secondary', currentInstitute.accent_color);
  }, [currentInstitute]);

  // Initial load: test backend connectivity and hydrate data
  const refreshBackendData = useCallback(async () => {
    setIsSyncing(true);
    try {
      // 1. Health check
      const health = await api.checkHealth();
      if (health.status !== 'UP') {
        throw new Error('Health check returned non-UP status');
      }

      // 2. Fetch live exams
      const apiExams = await api.getExams().catch(() => []);
      if (apiExams.length > 0) {
        const mappedExams = apiExams.map(mapApiExamToExam);
        setExams(mappedExams);
      }

      // 3. Fetch live batches
      const apiBatches = await api.getBatches().catch(() => []);
      if (apiBatches.length > 0) {
        setBatches(apiBatches.map(mapApiBatchToBatchUpload));
      }

      // 4. Fetch sheet evaluation data for current active sheet
      try {
        const evalData = await api.getSheetEvaluation(activeSheetId);
        if (evalData?.result) {
          const { sheet, result, pages } = mapApiSheetEvaluationToEntities(evalData);
          setAnswerSheets((prev) => {
            const exists = prev.some((s) => s.sheet_id === sheet.sheet_id);
            return exists ? prev.map((s) => (s.sheet_id === sheet.sheet_id ? sheet : s)) : [sheet, ...prev];
          });
          setResults((prev) => {
            const exists = prev.some((r) => r.result_id === result.result_id);
            return exists ? prev.map((r) => (r.result_id === result.result_id ? result : r)) : [result, ...prev];
          });
          if (pages.length > 0) {
            setActiveOCRPage(pages[0]);
          }
        }
      } catch (evalErr) {
        console.warn('Failed to load live evaluation data for', activeSheetId, evalErr);
      }

      // 5. Fetch live audit logs
      const apiLogs = await api.getAuditLogs().catch(() => []);
      if (apiLogs.length > 0) {
        setAuditLogs(apiLogs.map(mapApiAuditLogToAuditLog));
      }

      setIsBackendConnected(true);
    } catch (err) {
      console.info('Backend unreachable, running in local Squared Classes mode:', err);
      setIsBackendConnected(false);
    } finally {
      setIsSyncing(false);
    }
  }, [activeSheetId]);

  useEffect(() => {
    refreshBackendData();
  }, [refreshBackendData]);

  // When activeSheetId changes, load its evaluation details if backend connected
  useEffect(() => {
    if (!isBackendConnected) return;

    let isMounted = true;
    api
      .getSheetEvaluation(activeSheetId)
      .then((evalData) => {
        if (!isMounted || !evalData) return;
        const { sheet, result, pages } = mapApiSheetEvaluationToEntities(evalData);
        setAnswerSheets((prev) =>
          prev.some((s) => s.sheet_id === sheet.sheet_id)
            ? prev.map((s) => (s.sheet_id === sheet.sheet_id ? sheet : s))
            : [sheet, ...prev]
        );
        setResults((prev) =>
          prev.some((r) => r.result_id === result.result_id)
            ? prev.map((r) => (r.result_id === result.result_id ? result : r))
            : [result, ...prev]
        );
        if (pages.length > 0) {
          setActiveOCRPage(pages[0]);
        }
      })
      .catch((err) => console.warn('Could not fetch sheet data for', activeSheetId, err));

    return () => {
      isMounted = false;
    };
  }, [activeSheetId, isBackendConnected]);

  // Login handler
  const login = async (email: string, password: string, role: RoleEnum = 'TEACHER') => {
    localStorage.setItem('intelligrade_user_role', role);

    if (isBackendConnected) {
      try {
        const authResp = await api.login(email, password);
        if (authResp?.user) {
          const userRole = (authResp.user.role === 'ADMIN' ? 'ADMIN' : 'TEACHER') as RoleEnum;
          setCurrentUser({
            user_id: authResp.user.userId,
            name: authResp.user.name,
            email_hash: authResp.user.email,
            role_enum: userRole,
            institute_id: 'inst-squared',
            avatar_url: authResp.user.avatarUrl,
          });
          setIsAuthenticated(true);
          setActiveTab('dashboard');
          return;
        }
      } catch (err) {
        console.warn('Backend login error, falling back to local user:', err);
      }
    }

    // Local authentication fallback
    if (role === 'ADMIN') {
      setCurrentUser(mockAdminUser);
    } else {
      setCurrentUser(mockTeacherUser);
    }
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  // Logout handler
  const logout = () => {
    api.setToken(null);
    localStorage.removeItem('intelligrade_jwt_token');
    localStorage.removeItem('intelligrade_user_role');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const setUserRole = (role: RoleEnum) => {
    setCurrentUser((prev) => ({
      ...prev,
      role_enum: role,
      name: role === 'ADMIN' ? mockAdminUser.name : mockTeacherUser.name,
      avatar_url: role === 'ADMIN' ? mockAdminUser.avatar_url : mockTeacherUser.avatar_url,
    }));
    localStorage.setItem('intelligrade_user_role', role);
  };

  const addExam = async (newExam: Exam) => {
    setExams((prev) => [newExam, ...prev]);

    if (isBackendConnected) {
      try {
        await api.createExam({
          examId: newExam.exam_id,
          examTitle: newExam.exam_title,
          subject: newExam.subject,
          totalMarks: newExam.total_marks,
          instituteId: 'inst-squared',
          date: newExam.date,
          academicYear: newExam.academic_year,
        });
      } catch (err) {
        console.warn('Backend exam sync warning:', err);
      }
    }
  };

  const addBatch = async (newBatch: BatchUpload, file?: File | null) => {
    setBatches((prev) => [newBatch, ...prev]);

    if (isBackendConnected) {
      try {
        await api.uploadBatch(newBatch.exam_id, file, newBatch.batch_name);
      } catch (err) {
        console.warn('Backend batch upload error:', err);
      }
    }

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

  const updateEvaluationMarks = async (
    resultId: string,
    evalItemId: string,
    newMarks: number,
    reason: string
  ) => {
    const res = results.find((r) => r.result_id === resultId);
    const item = res?.evaluation_items.find((i) => i.eval_item_id === evalItemId);
    const questionId = item?.question_id || 'q-1';

    // Optimistic UI update
    setResults((prevResults) =>
      prevResults.map((r) => {
        if (r.result_id !== resultId) return r;

        let diff = 0;
        const updatedItems = r.evaluation_items.map((it) => {
          if (it.eval_item_id === evalItemId) {
            const oldMarks = it.teacher_marks !== undefined ? it.teacher_marks : it.marks_awarded;
            diff = newMarks - oldMarks;
            return {
              ...it,
              teacher_marks: newMarks,
              teacher_notes: reason,
              is_overridden: true,
            };
          }
          return it;
        });

        const newFinalScore = Math.min(r.total_marks, Math.max(0, r.final_score + diff));
        const newPercentage = Math.round((newFinalScore / r.total_marks) * 100);

        return {
          ...r,
          final_score: newFinalScore,
          percentage: newPercentage,
          evaluation_items: updatedItems,
        };
      })
    );

    // Optimistic Audit Log
    const newAuditEntry: AuditLog = {
      log_id: `log-${Date.now()}`,
      result_id: resultId,
      question_id: questionId,
      user_id: currentUser.user_id,
      user_name: currentUser.name,
      change_type: 'MARKS_OVERRIDE',
      old_marks: item?.marks_awarded ?? 0,
      new_marks: newMarks,
      reason: reason || 'Teacher manual calibration based on rubric review',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setAuditLogs((prevLogs) => [newAuditEntry, ...prevLogs]);

    // Live backend dispatch
    if (isBackendConnected) {
      try {
        const response = await api.overrideMarks(resultId, {
          questionId,
          teacherMarks: newMarks,
          teacherNotes: reason,
          teacherUserId: currentUser.user_id,
        });

        if (response?.result) {
          const { result: updatedResult } = mapApiSheetEvaluationToEntities(response);
          setResults((prev) =>
            prev.map((r) => (r.result_id === resultId ? updatedResult : r))
          );
        }

        const refreshedLogs = await api.getAuditLogs().catch(() => []);
        if (refreshedLogs.length > 0) {
          setAuditLogs(refreshedLogs.map(mapApiAuditLogToAuditLog));
        }
      } catch (err) {
        console.error('Failed to persist marks override on backend:', err);
      }
    }
  };

  const approveResult = async (resultId: string) => {
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

    if (isBackendConnected) {
      try {
        await api.approveResult(resultId, {
          approvedByUserId: currentUser.user_id,
          feedback: 'Teacher approved paper after rubric verification and justification review.',
        });
      } catch (err) {
        console.error('Failed to persist approve on backend:', err);
      }
    }
  };

  const dispatchWhatsApp = async (resultId: string) => {
    const res = results.find((r) => r.result_id === resultId);
    if (!res) return;

    setResults((prev) =>
      prev.map((r) => (r.result_id === resultId ? { ...r, status: 'PUBLISHED' as BatchStatus } : r))
    );

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
      payload_summary: `Squared Classes Scorecard: ${res.final_score}/${res.total_marks} (${res.percentage}%). Feedback: ${res.overall_feedback?.substring(0, 60) || 'Good performance'}...`,
    };

    setWhatsAppLogs((prev) => [newLog, ...prev]);

    if (isBackendConnected) {
      try {
        await api.dispatchWhatsApp({
          resultId,
          studentPhone: '+91 98765 43210',
          studentName: 'Aarav Saxena',
        });
      } catch (err) {
        console.warn('Backend whatsapp dispatch error:', err);
      }
    }

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
        setCurrentInstituteId: () => {},
        institutes: mockInstitutes,
        currentUser,
        setUserRole,
        isAuthenticated,
        login,
        logout,
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
        activeOCRPage,
        updateEvaluationMarks,
        approveResult,
        auditLogs,
        whatsAppLogs,
        dispatchWhatsApp,
        isBackendConnected,
        isSyncing,
        refreshBackendData,
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
