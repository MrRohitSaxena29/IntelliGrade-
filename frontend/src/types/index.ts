// IntelliGrade Type Definitions matching ER Diagram & Architecture

export type RoleEnum = 'TEACHER' | 'ADMIN' | 'EVALUATOR';

export type BatchStatus = 'QUEUED' | 'PROCESSING' | 'AI_GRADED' | 'TEACHER_REVIEWED' | 'PUBLISHED';

export type DeliveryStatus = 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

export interface Institute {
  institute_id: string;
  name: string;
  branding_logo_url: string;
  whatsapp_api_config_json: {
    senderPhoneId: string;
    templateNamespace: string;
    webhookVerified: boolean;
  };
  primary_color: string;
  accent_color: string;
  tagline: string;
}

export interface User {
  user_id: string;
  name: string;
  email_hash: string;
  role_enum: RoleEnum;
  institute_id: string;
  avatar_url?: string;
}

export interface Student {
  student_id: string;
  name: string;
  roll_number: string;
  whatsapp_phone_number: string;
  institute_id: string;
  grade_section: string;
}

export interface FacultyMember {
  faculty_id: string;
  name: string;
  email: string;
  department: 'Physics' | 'Chemistry' | 'Mathematics' | 'Foundation Science' | 'Social Science' | 'English';
  classes_assigned: string[];
  role_title: string;
  sheets_graded_count: number;
  accuracy_rate: number;
  avatar_url: string;
  status: 'ACTIVE' | 'ON_LEAVE';
}

export interface Exam {
  exam_id: string;
  exam_title: string;
  subject: string;
  grade_level?: 'Class 12' | 'Class 11' | 'Class 10' | 'Class 9' | 'Class 8';
  total_marks: number;
  institute_id: string;
  date: string;
  academic_year: string;
}

export interface Question {
  question_id: string;
  exam_id: string;
  question_number: number;
  question_text: string;
  max_marks: number;
}

export interface Rubric {
  rubric_id: string;
  question_id: string;
  criteria_text: string;
  weightage_points: number;
  ai_grading_prompt?: string;
}

export interface BatchUpload {
  upload_id: string;
  exam_id: string;
  user_id: string;
  batch_name: string;
  batch_status: BatchStatus;
  s3_archive_url: string;
  total_sheets: number;
  processed_sheets: number;
  uploaded_at: string;
  processing_step?: string; // e.g. "Running PaddleOCR v2.6...", "LLM Grading (Prompt inject)..."
}

export interface AnswerSheet {
  sheet_id: string;
  batch_upload_id: string;
  student_id: string;
  extracted_student_roll: string;
  s3_pdf_url: string;
  page_count: number;
  status: BatchStatus;
  uploaded_at: string;
}

export interface OCRBoundingBox {
  box_id: string;
  page_id: string;
  question_id: string;
  coordinates: {
    x: number; // percentage or px
    y: number;
    width: number;
    height: number;
  };
  detected_text: string;
  confidence_score: number; // e.g. 0.94
  line_index: number;
}

export interface OCRPage {
  page_id: string;
  sheet_id: string;
  page_number: number;
  full_text_content: string;
  image_preview_url: string;
  bounding_boxes: OCRBoundingBox[];
}

export interface EvaluationItem {
  eval_item_id: string;
  result_id: string;
  question_id: string;
  rubric_id: string;
  marks_awarded: number;
  max_marks: number;
  ai_justification: string;
  key_positives: string[];
  key_gaps: string[];
  teacher_marks?: number;
  teacher_notes?: string;
  is_overridden: boolean;
}

export interface Result {
  result_id: string;
  sheet_id: string;
  exam_id: string;
  student_id: string;
  final_score: number;
  total_marks: number;
  percentage: number;
  grade_letter: string;
  overall_feedback: string;
  status: BatchStatus;
  s3_report_url?: string;
  approved_by_user_id?: string;
  approved_at?: string;
  evaluation_items: EvaluationItem[];
}

export interface AuditLog {
  log_id: string;
  result_id: string;
  question_id: string;
  user_id: string;
  user_name: string;
  change_type: 'MARKS_OVERRIDE' | 'STATUS_APPROVE' | 'FEEDBACK_EDIT';
  old_marks: number;
  new_marks: number;
  reason: string;
  timestamp: string;
}

export interface WhatsAppDeliveryLog {
  delivery_id: string;
  result_id: string;
  student_id: string;
  student_name: string;
  roll_number: string;
  whatsapp_phone_number: string;
  message_id_external: string;
  delivery_status: DeliveryStatus;
  dispatched_at: string;
  delivered_at?: string;
  read_at?: string;
  error_message?: string;
  payload_summary: string;
}
