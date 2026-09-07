/**
 * IntelliGrade REST API Client
 * Provides typed, authenticated HTTP communication with the Spring Boot backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_STORAGE_KEY = 'intelligrade_jwt_token';
const USER_STORAGE_KEY = 'intelligrade_auth_user';

export interface ApiAuthUser {
  userId: string;
  instituteId: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface ApiAuthResponse {
  token: string;
  tokenType: string;
  user: ApiAuthUser;
}

export interface ApiDashboardMetrics {
  totalSheetsEvaluated: number;
  averageAiAccuracy: number;
  pendingTeacherReviews: number;
  whatsAppDeliveryRate: number;
  totalExams: number;
  totalBatches: number;
  gradeDistribution: Record<string, number>;
  recentBatches: ApiBatchSummary[];
  recentActivity: ApiAuditLog[];
}

export interface ApiExamDetail {
  examId: string;
  examTitle: string;
  subject: string;
  totalMarks: number;
  instituteId: string;
  date: string;
  academicYear: string;
  questionCount?: number;
  status?: string;
  createdAt?: string;
}

export interface ApiBatchSummary {
  uploadId: string;
  examId: string;
  examTitle?: string;
  userId: string;
  batchName: string;
  batchStatus: string;
  s3ArchiveUrl: string;
  totalSheets: number;
  processedSheets: number;
  processingStep?: string;
  uploadedAt: string;
}

export interface ApiSheetEvaluationResponse {
  sheetId: string;
  examId: string;
  examTitle: string;
  student: {
    studentId: string;
    name: string;
    rollNumber: string;
    gradeSection: string;
    whatsappPhoneNumber: string;
  };
  s3PdfUrl: string;
  pageCount: number;
  status: string;
  uploadedAt: string;
  pages: ApiOCRPage[];
  result: ApiResultDetail;
}

export interface ApiOCRPage {
  pageId: string;
  pageNumber: number;
  fullTextContent: string;
  imagePreviewUrl: string;
  boundingBoxes: ApiBoundingBox[];
}

export interface ApiBoundingBox {
  boxId: string;
  questionId: string;
  coordX: number;
  coordY: number;
  coordWidth: number;
  coordHeight: number;
  detectedText: string;
  confidenceScore: number;
  lineIndex: number;
}

export interface ApiResultDetail {
  resultId: string;
  sheetId: string;
  examId: string;
  studentId: string;
  finalScore: number;
  totalMarks: number;
  percentage: number;
  gradeLetter: string;
  overallFeedback: string;
  status: string;
  s3ReportUrl?: string;
  approvedByUserId?: string;
  approvedAt?: string;
  items: ApiEvaluationItem[];
}

export interface ApiEvaluationItem {
  evalItemId: string;
  questionId: string;
  rubricId: string;
  marksAwarded: number;
  maxMarks: number;
  aiJustification: string;
  keyPositives: string[];
  keyGaps: string[];
  teacherMarks?: number;
  teacherNotes?: string;
  isOverridden: boolean;
}

export interface ApiAuditLog {
  logId: string;
  resultId: string;
  questionId?: string;
  userId: string;
  userName: string;
  action: string;
  priorValue?: number;
  newValue?: number;
  justification: string;
  createdAt: string;
}

export interface ApiWhatsAppDispatch {
  dispatchId: string;
  resultId: string;
  studentPhone: string;
  messageId: string;
  status: string;
  timestamp: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  public setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }

  public getToken(): string | null {
    return this.token || localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) errorMessage = errorJson.message;
      } catch {
        if (errorText) errorMessage += ` - ${errorText}`;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json() as Promise<T>;
  }

  // Health check
  public async checkHealth(): Promise<{ status: string; version: string; service: string }> {
    return this.request<{ status: string; version: string; service: string }>('/health');
  }

  // Authentication
  public async login(email: string, password: string): Promise<ApiAuthResponse> {
    const res = await this.request<ApiAuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
    return res;
  }

  public async getMe(): Promise<ApiAuthUser> {
    return this.request<ApiAuthUser>('/auth/me');
  }

  // Dashboard Metrics
  public async getDashboardMetrics(): Promise<ApiDashboardMetrics> {
    return this.request<ApiDashboardMetrics>('/dashboard/metrics');
  }

  // Exams
  public async getExams(instituteId?: string): Promise<ApiExamDetail[]> {
    const query = instituteId ? `?instituteId=${encodeURIComponent(instituteId)}` : '';
    return this.request<ApiExamDetail[]>(`/exams${query}`);
  }

  public async getExamById(id: string): Promise<ApiExamDetail> {
    return this.request<ApiExamDetail>(`/exams/${id}`);
  }

  public async createExam(exam: Partial<ApiExamDetail>): Promise<ApiExamDetail> {
    return this.request<ApiExamDetail>('/exams', {
      method: 'POST',
      body: JSON.stringify(exam),
    });
  }

  // Batches
  public async getBatches(examId?: string): Promise<ApiBatchSummary[]> {
    const query = examId ? `?examId=${encodeURIComponent(examId)}` : '';
    return this.request<ApiBatchSummary[]>(`/batches${query}`);
  }

  public async getBatchById(id: string): Promise<ApiBatchSummary> {
    return this.request<ApiBatchSummary>(`/batches/${id}`);
  }

  public async uploadBatch(
    examId: string,
    file?: File | null,
    batchName?: string
  ): Promise<any> {
    const formData = new FormData();
    formData.append('examId', examId);
    if (batchName) formData.append('batchName', batchName);
    if (file) formData.append('file', file);

    return this.request<any>('/batches/upload', {
      method: 'POST',
      body: formData,
    });
  }

  // Evaluation Studio
  public async getSheetEvaluation(sheetId: string): Promise<ApiSheetEvaluationResponse> {
    return this.request<ApiSheetEvaluationResponse>(`/sheets/${sheetId}/evaluation`);
  }

  public async overrideMarks(
    resultId: string,
    payload: {
      questionId: string;
      teacherMarks: number;
      teacherNotes?: string;
      teacherUserId?: string;
    }
  ): Promise<ApiSheetEvaluationResponse> {
    return this.request<ApiSheetEvaluationResponse>(`/results/${resultId}/override`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async approveResult(
    resultId: string,
    payload: {
      approvedByUserId?: string;
      feedback?: string;
    } = {}
  ): Promise<ApiSheetEvaluationResponse> {
    return this.request<ApiSheetEvaluationResponse>(`/results/${resultId}/approve`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Audit Logs
  public async getAuditLogs(resultId?: string): Promise<ApiAuditLog[]> {
    const query = resultId ? `?resultId=${encodeURIComponent(resultId)}` : '';
    return this.request<ApiAuditLog[]>(`/audit-logs${query}`);
  }

  // WhatsApp
  public async dispatchWhatsApp(payload: {
    resultId: string;
    studentPhone?: string;
    studentName?: string;
  }): Promise<ApiWhatsAppDispatch> {
    return this.request<ApiWhatsAppDispatch>('/whatsapp/dispatch', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async getWhatsAppStatus(dispatchId: string): Promise<ApiWhatsAppDispatch> {
    return this.request<ApiWhatsAppDispatch>(`/whatsapp/status/${dispatchId}`);
  }
}

export const api = new ApiClient();
