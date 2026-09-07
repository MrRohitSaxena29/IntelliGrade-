-- ============================================================================
-- IntelliGrade: AI Answer Sheet Evaluation System
-- PostgreSQL Seed Data Script
-- Populates initial institutes, users, students, exams, rubrics, results, audit logs
-- ============================================================================

-- 1. Institutes
INSERT INTO institutes (institute_id, name, branding_logo_url, primary_color, accent_color, tagline, whatsapp_api_config_json)
VALUES 
(
    'inst-1',
    'Delhi Public School, R.K. Puram',
    'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
    '#4f46e5',
    '#06b6d4',
    'Service Before Self • Accredited CBSE Center',
    '{"senderPhoneId": "PHONE_DPS_9101", "templateNamespace": "dps_intelligrade_reports", "webhookVerified": true}'::jsonb
),
(
    'inst-2',
    'Apex IIT-JEE Science Academy',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&auto=format&fit=crop&q=80',
    '#0284c7',
    '#10b981',
    'Precision AI Assessment & Rank Predictor',
    '{"senderPhoneId": "PHONE_APEX_8802", "templateNamespace": "apex_eval_scorecard", "webhookVerified": true}'::jsonb
),
(
    'inst-3',
    'St. Xavier International School',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80',
    '#8b5cf6',
    '#ec4899',
    'Empowering Next-Gen Learners with AI',
    '{"senderPhoneId": "PHONE_STX_7703", "templateNamespace": "xavier_instant_grades", "webhookVerified": true}'::jsonb
)
ON CONFLICT (institute_id) DO NOTHING;

-- 2. Users (Password is 'password123' bcrypt hashed: $2a$10$7R.. / standard test hash)
INSERT INTO users (user_id, institute_id, name, email, password_hash, role_enum, avatar_url)
VALUES 
(
    'usr-101',
    'inst-1',
    'Dr. Radhika Sharma',
    'radhika.sharma@dpsrkp.edu.in',
    '$2a$10$w8TfJ4b5/hN1q2s3u4v5w.abcdefghijklmnopqrstuvwx1234567890',
    'TEACHER',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
),
(
    'usr-102',
    'inst-1',
    'Principal Rajesh Malhotra',
    'admin@dpsrkp.edu.in',
    '$2a$10$w8TfJ4b5/hN1q2s3u4v5w.abcdefghijklmnopqrstuvwx1234567890',
    'ADMIN',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
)
ON CONFLICT (user_id) DO NOTHING;

-- 3. Students
INSERT INTO students (student_id, institute_id, name, roll_number, whatsapp_phone_number, grade_section)
VALUES 
('stu-101', 'inst-1', 'Aarav Saxena', '12044', '+91 98765 43210', 'Grade 12-A'),
('stu-102', 'inst-1', 'Ananya Verma', '12045', '+91 98112 34567', 'Grade 12-A'),
('stu-103', 'inst-1', 'Rohan Kulkarni', '12048', '+91 99234 56789', 'Grade 12-B'),
('stu-104', 'inst-1', 'Priya Nair', '12052', '+91 97654 32109', 'Grade 12-B')
ON CONFLICT (student_id) DO NOTHING;

-- 4. Exams
INSERT INTO exams (exam_id, institute_id, exam_title, subject, total_marks, date, academic_year)
VALUES 
('exam-101', 'inst-1', 'Class XII - Physics Mid-Term Board Simulation', 'Physics (Electrodynamics & Optics)', 50.0, '2026-08-28', '2026-2027'),
('exam-102', 'inst-1', 'Class XI - Advanced Calculus Assessment', 'Mathematics', 60.0, '2026-09-02', '2026-2027'),
('exam-103', 'inst-1', 'Class XII - Chemistry Organic Mechanisms', 'Chemistry', 70.0, '2026-09-04', '2026-2027')
ON CONFLICT (exam_id) DO NOTHING;

-- 5. Questions
INSERT INTO questions (question_id, exam_id, question_number, question_text, max_marks)
VALUES 
('q-1', 'exam-101', 1, 'Using Biot-Savart Law, derive the formula for the magnetic field at the center of a circular coil carrying current I. State units and vector direction.', 5.0),
('q-2', 'exam-101', 2, 'State Gauss''s Law in electrostatics. Calculate the net electric flux leaving an enclosed closed Gaussian cubical box containing a dipole of charge ±5µC.', 5.0),
('q-3', 'exam-101', 3, 'Explain Total Internal Reflection (TIR). Deduce the mathematical relationship between the critical angle and refractive index with an optical ray diagram.', 5.0)
ON CONFLICT (question_id) DO NOTHING;

-- 6. Rubrics
INSERT INTO rubrics (rubric_id, question_id, criteria_text, weightage_points, ai_grading_prompt)
VALUES 
('rub-1', 'q-1', 'Biot-Savart differential equation dB = (µ0/4π) * (I dl sin θ / r^2) stated with vector cross product or angle = 90 deg.', 1.5, 'Verify formula contains µ0, 4pi denominator, I dl cross r vector form.'),
('rub-2', 'q-1', 'Integration step over circular perimeter integral(dl) = 2*pi*R with correct cancellation.', 2.0, 'Check boundary integration from 0 to 2pi R leading to B = µ0 I / (2 R).'),
('rub-3', 'q-1', 'Direction determined by Right-Hand Thumb Rule and SI Unit (Tesla / T) explicitly specified.', 1.5, 'Ensure unit Tesla or Wb/m^2 and Right-Hand Grip Rule is stated.'),
('rub-4', 'q-2', 'Gauss''s law statement: Total flux = Q_enclosed / epsilon_0.', 2.0, 'Check definition and formula with epsilon_0.'),
('rub-5', 'q-2', 'Dipole net charge calculation: Q_net = (+5µC) + (-5µC) = 0.', 2.0, 'Verify total dipole charge sums to zero.'),
('rub-6', 'q-2', 'Final conclusion: Net electric flux is Zero (0 N m^2 / C).', 1.0, 'Check zero flux with correct SI units.')
ON CONFLICT (rubric_id) DO NOTHING;

-- 7. Batch Uploads
INSERT INTO batch_uploads (upload_id, exam_id, user_id, batch_name, batch_status, s3_archive_url, total_sheets, processed_sheets, processing_step, uploaded_at)
VALUES 
('batch-001', 'exam-101', 'usr-101', 'Physics_XIIA_Term1_Scans.zip', 'AI_GRADED', 's3://intelligrade-vault/batches/Physics_XIIA_Term1.tar.gz', 36, 36, 'Completed OCR & LLM Evaluator', '2026-09-05 14:30:00+05:30'),
('batch-002', 'exam-101', 'usr-101', 'Physics_XIIB_Retest_Sheets.zip', 'PROCESSING', 's3://intelligrade-vault/batches/Physics_XIIB_Retest.zip', 24, 18, 'PaddleOCR Vision Engine: Extracting Sheet #19 bounding boxes...', '2026-09-06 19:40:00+05:30'),
('batch-003', 'exam-102', 'usr-101', 'Calculus_Midterm_Batch3.zip', 'QUEUED', 's3://intelligrade-vault/batches/Calculus_Batch3.zip', 40, 0, 'Queued in Redis Celery worker pool', '2026-09-06 21:50:00+05:30')
ON CONFLICT (upload_id) DO NOTHING;

-- 8. Answer Sheets
INSERT INTO answer_sheets (sheet_id, batch_upload_id, student_id, extracted_student_roll, s3_pdf_url, page_count, status, uploaded_at)
VALUES 
('sheet-101', 'batch-001', 'stu-101', '12044', 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&auto=format&fit=crop&q=80', 3, 'AI_GRADED', '2026-09-05 14:32:00+05:30'),
('sheet-102', 'batch-001', 'stu-102', '12045', 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&auto=format&fit=crop&q=80', 3, 'TEACHER_REVIEWED', '2026-09-05 14:35:00+05:30')
ON CONFLICT (sheet_id) DO NOTHING;

-- 9. OCR Pages & Bounding Boxes
INSERT INTO ocr_pages (page_id, sheet_id, page_number, full_text_content, image_preview_url)
VALUES 
('ocr-pg-1', 'sheet-101', 1, 
'Roll No: 12044 | Student: Aarav Saxena | Subject: Physics XII
Q1. According to Biot-Savart Law, the small magnetic field dB produced by an element dl carrying current I at distance r is given by: dB = (µ0 / 4π) * (I dl × r̂) / r²
For a circular coil of radius R: Angle between dl and radius vector is 90° -> sin 90° = 1.
Integrating over full circular perimeter: B = ∫ dB = (µ0 I / 4π R²) ∫ dl = (µ0 I / 4π R²) * 2π R => B = µ0 I / (2 R).
Direction: Right-Hand Thumb Rule (perpendicular to coil plane). Unit is Tesla.
Q2. Gauss''s Law states that total electric flux Φ through a closed surface is equal to Q_enclosed / ε0.
For a dipole enclosed inside a cube: Total enclosed charge Q_enc = (+5 µC) + (-5 µC) = 0.
Therefore, net electric flux Φ = 0 / ε0 = 0 N·m²/C.',
'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&auto=format&fit=crop&q=80'
)
ON CONFLICT (page_id) DO NOTHING;

INSERT INTO ocr_bounding_boxes (box_id, page_id, question_id, coord_x, coord_y, coord_width, coord_height, detected_text, confidence_score, line_index)
VALUES 
('box-1', 'ocr-pg-1', 'q-1', 5, 8, 90, 7, 'Roll No: 12044 | Student: Aarav Saxena | Subject: Physics XII', 0.98, 1),
('box-2', 'ocr-pg-1', 'q-1', 5, 17, 88, 8, 'dB = (µ0 / 4π) * (I dl × r̂) / r²  [Biot Savart Law Vector Form]', 0.96, 2),
('box-3', 'ocr-pg-1', 'q-1', 5, 27, 85, 9, 'Angle between dl and radius is 90° => sin 90° = 1', 0.94, 3),
('box-4', 'ocr-pg-1', 'q-1', 5, 38, 82, 10, 'B = ∫ dB = (µ0 I / 4π R²) * (2π R) = µ0 I / (2 R)', 0.97, 4),
('box-5', 'ocr-pg-1', 'q-1', 5, 50, 80, 7, 'Direction: Right Hand Grip Rule (perpendicular to coil). Unit: Tesla.', 0.93, 5),
('box-6', 'ocr-pg-1', 'q-2', 5, 62, 90, 9, 'Q2. Gauss''s Law: Φ = ∮ E·dA = Q_enclosed / ε0', 0.95, 6),
('box-7', 'ocr-pg-1', 'q-2', 5, 73, 88, 9, 'Dipole: Q_enclosed = (+5 µC) + (-5 µC) = 0 µC', 0.99, 7),
('box-8', 'ocr-pg-1', 'q-2', 5, 84, 85, 8, 'Net electric flux Φ = 0 / ε0 = 0 N·m²/C', 0.97, 8)
ON CONFLICT (box_id) DO NOTHING;

-- 10. Results & Evaluation Items
INSERT INTO results (result_id, sheet_id, exam_id, student_id, final_score, total_marks, percentage, grade_letter, overall_feedback, status, s3_report_url)
VALUES 
(
    'res-101',
    'sheet-101',
    'exam-101',
    'stu-101',
    46.5,
    50.0,
    93.0,
    'A1',
    'Outstanding grasp of electrodynamics fundamentals. Derivations are rigorous, neatly structured, and mathematically verified. Highly commendable work on boundary conditions.',
    'AI_GRADED',
    'https://intelligrade.s3.amazonaws.com/reports/12044_Physics_Scorecard.pdf'
),
(
    'res-102',
    'sheet-102',
    'exam-101',
    'stu-102',
    48.0,
    50.0,
    96.0,
    'A1+',
    'Exceptional handwritten submission. Neat optical ray diagrams and comprehensive mathematical justifications.',
    'TEACHER_REVIEWED',
    'https://intelligrade.s3.amazonaws.com/reports/12045_Physics_Scorecard.pdf'
)
ON CONFLICT (result_id) DO NOTHING;

INSERT INTO evaluation_items (eval_item_id, result_id, question_id, rubric_id, marks_awarded, max_marks, ai_justification, key_positives, key_gaps, is_overridden)
VALUES 
(
    'eval-1',
    'res-101',
    'q-1',
    'rub-1',
    4.5,
    5.0,
    'Accurate Biot-Savart vector formulation and step-by-step circular loop integration. Full marks for derivation. Deducted 0.5 for slightly brief right-hand rule explanation.',
    '["Vector cross product formula explicitly stated", "Integration limits (0 to 2πR) clearly applied", "Final algebraic simplification B = µ0 I / 2R is flawless"]'::jsonb,
    '["Could have explicitly sketched current arrow orientation on the circular loop perimeter."]'::jsonb,
    FALSE
),
(
    'eval-2',
    'res-101',
    'q-2',
    'rub-4',
    5.0,
    5.0,
    'Perfect execution. Complete definition of Gauss''s Law followed by algebraic demonstration that dipole total charge = 0, proving flux is zero.',
    '["Correct surface integral formula with vector notation", "Accurate zero flux conclusion with SI units (N m^2 / C)"]'::jsonb,
    '[]'::jsonb,
    FALSE
),
(
    'eval-3',
    'res-101',
    'q-3',
    'rub-1',
    4.5,
    5.0,
    'Both conditions for TIR clearly enumerated. Snell law applied at critical angle 90 degrees with correct reciprocal relation.',
    '["Dual conditions for TIR verified", "Correct trigonometric deduction 1/sin(C)"]'::jsonb,
    '["Ray diagram was slightly faint in scanned image, though mathematically verified."]'::jsonb,
    FALSE
)
ON CONFLICT (eval_item_id) DO NOTHING;

-- 11. Audit Logs
INSERT INTO audit_logs (log_id, result_id, question_id, user_id, user_name, change_type, old_marks, new_marks, reason, created_at)
VALUES 
(
    'log-501',
    'res-102',
    'q-1',
    'usr-101',
    'Dr. Radhika Sharma',
    'MARKS_OVERRIDE',
    4.5,
    5.0,
    'Student provided an additional neat cross-sectional field line sketch justifying complete 5.0 marks.',
    '2026-09-06 11:15:00+05:30'
),
(
    'log-502',
    'res-102',
    'q-all',
    'usr-101',
    'Dr. Radhika Sharma',
    'STATUS_APPROVE',
    48.0,
    48.0,
    'Teacher approved final scorecard for branded PDF generation and parent WhatsApp dispatch.',
    '2026-09-06 11:20:00+05:30'
)
ON CONFLICT (log_id) DO NOTHING;

-- 12. WhatsApp Delivery Logs
INSERT INTO whatsapp_delivery_logs (delivery_id, result_id, student_id, student_name, roll_number, whatsapp_phone_number, message_id_external, delivery_status, payload_summary, dispatched_at, delivered_at, read_at)
VALUES 
(
    'wa-901',
    'res-102',
    'stu-102',
    'Ananya Verma',
    '12045',
    '+91 98112 34567',
    'wamid.HBgMOTE5ODExMjM0NTY3FQIAERgSM0VGOUVCNUM5',
    'READ',
    'Dear Parent, Physics Term 1 scorecard for Ananya Verma (Roll: 12045) is ready: 48/50 (96%). Tap to view official verified report.',
    '2026-09-06 11:22:00+05:30',
    '2026-09-06 11:22:00+05:30',
    '2026-09-06 11:25:00+05:30'
),
(
    'wa-902',
    'res-101',
    'stu-101',
    'Aarav Saxena',
    '12044',
    '+91 98765 43210',
    'wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSODFDNThGMDM3',
    'QUEUED',
    'Ready for dispatch upon Teacher Review approval.',
    '2026-09-06 21:55:00+05:30',
    NULL,
    NULL
)
ON CONFLICT (delivery_id) DO NOTHING;
