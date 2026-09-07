-- ============================================================================
-- IntelliGrade: AI Answer Sheet Evaluation System
-- PostgreSQL Relational Database Schema
-- Matches ER Diagram & Architecture Specification
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. Institutes (Multi-Tenant Organizations)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS institutes (
    institute_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    branding_logo_url TEXT,
    primary_color VARCHAR(32) DEFAULT '#4f46e5',
    accent_color VARCHAR(32) DEFAULT '#06b6d4',
    tagline VARCHAR(255),
    whatsapp_api_config_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. Users (Teachers, Evaluators, Admins)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(64) PRIMARY KEY,
    institute_id VARCHAR(64) NOT NULL REFERENCES institutes(institute_id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_enum VARCHAR(32) NOT NULL CHECK (role_enum IN ('TEACHER', 'ADMIN', 'EVALUATOR')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. Students
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(64) PRIMARY KEY,
    institute_id VARCHAR(64) NOT NULL REFERENCES institutes(institute_id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    roll_number VARCHAR(64) NOT NULL,
    whatsapp_phone_number VARCHAR(32) NOT NULL,
    grade_section VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_roll_inst UNIQUE (institute_id, roll_number)
);

-- ----------------------------------------------------------------------------
-- 4. Exams
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS exams (
    exam_id VARCHAR(64) PRIMARY KEY,
    institute_id VARCHAR(64) NOT NULL REFERENCES institutes(institute_id) ON DELETE CASCADE,
    exam_title VARCHAR(255) NOT NULL,
    subject VARCHAR(128) NOT NULL,
    total_marks NUMERIC(6, 2) NOT NULL,
    date DATE NOT NULL,
    academic_year VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 5. Questions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
    question_id VARCHAR(64) PRIMARY KEY,
    exam_id VARCHAR(64) NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
    question_number INT NOT NULL,
    question_text TEXT NOT NULL,
    max_marks NUMERIC(6, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_exam_question UNIQUE (exam_id, question_number)
);

-- ----------------------------------------------------------------------------
-- 6. Rubrics (Step-Wise Criteria for AI Grading)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rubrics (
    rubric_id VARCHAR(64) PRIMARY KEY,
    question_id VARCHAR(64) NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    criteria_text TEXT NOT NULL,
    weightage_points NUMERIC(5, 2) NOT NULL,
    ai_grading_prompt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 7. Batch Uploads (ZIP / PDF Multi-Sheet Batches)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS batch_uploads (
    upload_id VARCHAR(64) PRIMARY KEY,
    exam_id VARCHAR(64) NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(user_id),
    batch_name VARCHAR(255) NOT NULL,
    batch_status VARCHAR(32) NOT NULL DEFAULT 'QUEUED'
        CHECK (batch_status IN ('QUEUED', 'PROCESSING', 'AI_GRADED', 'TEACHER_REVIEWED', 'PUBLISHED')),
    s3_archive_url TEXT,
    total_sheets INT NOT NULL DEFAULT 0,
    processed_sheets INT NOT NULL DEFAULT 0,
    processing_step TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ----------------------------------------------------------------------------
-- 8. Answer Sheets (Individual Student Scanned Submissions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS answer_sheets (
    sheet_id VARCHAR(64) PRIMARY KEY,
    batch_upload_id VARCHAR(64) NOT NULL REFERENCES batch_uploads(upload_id) ON DELETE CASCADE,
    student_id VARCHAR(64) REFERENCES students(student_id) ON DELETE SET NULL,
    extracted_student_roll VARCHAR(64),
    s3_pdf_url TEXT NOT NULL,
    page_count INT NOT NULL DEFAULT 1,
    status VARCHAR(32) NOT NULL DEFAULT 'QUEUED'
        CHECK (status IN ('QUEUED', 'PROCESSING', 'AI_GRADED', 'TEACHER_REVIEWED', 'PUBLISHED')),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 9. OCR Pages & Bounding Boxes (PaddleOCR Extraction)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ocr_pages (
    page_id VARCHAR(64) PRIMARY KEY,
    sheet_id VARCHAR(64) NOT NULL REFERENCES answer_sheets(sheet_id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    full_text_content TEXT,
    image_preview_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_sheet_page UNIQUE (sheet_id, page_number)
);

CREATE TABLE IF NOT EXISTS ocr_bounding_boxes (
    box_id VARCHAR(64) PRIMARY KEY,
    page_id VARCHAR(64) NOT NULL REFERENCES ocr_pages(page_id) ON DELETE CASCADE,
    question_id VARCHAR(64) REFERENCES questions(question_id) ON DELETE SET NULL,
    coord_x NUMERIC(6, 2) NOT NULL,
    coord_y NUMERIC(6, 2) NOT NULL,
    coord_width NUMERIC(6, 2) NOT NULL,
    coord_height NUMERIC(6, 2) NOT NULL,
    detected_text TEXT NOT NULL,
    confidence_score NUMERIC(5, 4) NOT NULL,
    line_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 10. Results & Evaluation Items (AI & Teacher Evaluated Marks)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS results (
    result_id VARCHAR(64) PRIMARY KEY,
    sheet_id VARCHAR(64) NOT NULL UNIQUE REFERENCES answer_sheets(sheet_id) ON DELETE CASCADE,
    exam_id VARCHAR(64) NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    final_score NUMERIC(6, 2) NOT NULL DEFAULT 0.0,
    total_marks NUMERIC(6, 2) NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    grade_letter VARCHAR(8) NOT NULL DEFAULT 'N/A',
    overall_feedback TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'AI_GRADED'
        CHECK (status IN ('QUEUED', 'PROCESSING', 'AI_GRADED', 'TEACHER_REVIEWED', 'PUBLISHED')),
    s3_report_url TEXT,
    approved_by_user_id VARCHAR(64) REFERENCES users(user_id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evaluation_items (
    eval_item_id VARCHAR(64) PRIMARY KEY,
    result_id VARCHAR(64) NOT NULL REFERENCES results(result_id) ON DELETE CASCADE,
    question_id VARCHAR(64) NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    rubric_id VARCHAR(64) REFERENCES rubrics(rubric_id) ON DELETE SET NULL,
    marks_awarded NUMERIC(5, 2) NOT NULL,
    max_marks NUMERIC(5, 2) NOT NULL,
    ai_justification TEXT,
    key_positives JSONB DEFAULT '[]'::JSONB,
    key_gaps JSONB DEFAULT '[]'::JSONB,
    teacher_marks NUMERIC(5, 2),
    teacher_notes TEXT,
    is_overridden BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 11. Audit Logs (Compliance & Manual Teacher Override Tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    log_id VARCHAR(64) PRIMARY KEY,
    result_id VARCHAR(64) NOT NULL REFERENCES results(result_id) ON DELETE CASCADE,
    question_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL REFERENCES users(user_id),
    user_name VARCHAR(128) NOT NULL,
    change_type VARCHAR(32) NOT NULL CHECK (change_type IN ('MARKS_OVERRIDE', 'STATUS_APPROVE', 'FEEDBACK_EDIT')),
    old_marks NUMERIC(5, 2) NOT NULL,
    new_marks NUMERIC(5, 2) NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 12. WhatsApp Delivery Logs (Meta Cloud API Outbound Tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS whatsapp_delivery_logs (
    delivery_id VARCHAR(64) PRIMARY KEY,
    result_id VARCHAR(64) NOT NULL REFERENCES results(result_id) ON DELETE CASCADE,
    student_id VARCHAR(64) NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    student_name VARCHAR(128) NOT NULL,
    roll_number VARCHAR(64) NOT NULL,
    whatsapp_phone_number VARCHAR(32) NOT NULL,
    message_id_external VARCHAR(128) NOT NULL,
    delivery_status VARCHAR(32) NOT NULL DEFAULT 'QUEUED'
        CHECK (delivery_status IN ('QUEUED', 'SENT', 'DELIVERED', 'READ', 'FAILED')),
    payload_summary TEXT,
    error_message TEXT,
    dispatched_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for high-frequency queries
CREATE INDEX IF NOT EXISTS idx_users_institute ON users(institute_id);
CREATE INDEX IF NOT EXISTS idx_exams_institute ON exams(institute_id);
CREATE INDEX IF NOT EXISTS idx_students_institute ON students(institute_id);
CREATE INDEX IF NOT EXISTS idx_batch_exam ON batch_uploads(exam_id);
CREATE INDEX IF NOT EXISTS idx_sheets_batch ON answer_sheets(batch_upload_id);
CREATE INDEX IF NOT EXISTS idx_results_exam ON results(exam_id);
CREATE INDEX IF NOT EXISTS idx_results_student ON results(student_id);
CREATE INDEX IF NOT EXISTS idx_eval_items_result ON evaluation_items(result_id);
CREATE INDEX IF NOT EXISTS idx_audit_result ON audit_logs(result_id);
CREATE INDEX IF NOT EXISTS idx_wa_result ON whatsapp_delivery_logs(result_id);
