import {
  Institute,
  User,
  Student,
  Exam,
  Question,
  Rubric,
  BatchUpload,
  AnswerSheet,
  OCRPage,
  Result,
  AuditLog,
  WhatsAppDeliveryLog,
} from '../types';

export const mockInstitutes: Institute[] = [
  {
    institute_id: 'inst-1',
    name: 'Delhi Public School, R.K. Puram',
    branding_logo_url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
    whatsapp_api_config_json: {
      senderPhoneId: 'PHONE_DPS_9101',
      templateNamespace: 'dps_intelligrade_reports',
      webhookVerified: true,
    },
    primary_color: '#4f46e5',
    accent_color: '#06b6d4',
    tagline: 'Service Before Self • Accredited CBSE Center',
  },
  {
    institute_id: 'inst-2',
    name: 'Apex IIT-JEE Science Academy',
    branding_logo_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=120&auto=format&fit=crop&q=80',
    whatsapp_api_config_json: {
      senderPhoneId: 'PHONE_APEX_8802',
      templateNamespace: 'apex_eval_scorecard',
      webhookVerified: true,
    },
    primary_color: '#0284c7',
    accent_color: '#10b981',
    tagline: 'Precision AI Assessment & Rank Predictor',
  },
  {
    institute_id: 'inst-3',
    name: 'St. Xavier International School',
    branding_logo_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=80',
    whatsapp_api_config_json: {
      senderPhoneId: 'PHONE_STX_7703',
      templateNamespace: 'xavier_instant_grades',
      webhookVerified: true,
    },
    primary_color: '#8b5cf6',
    accent_color: '#ec4899',
    tagline: 'Empowering Next-Gen Learners with AI',
  },
];

export const mockCurrentUser: User = {
  user_id: 'usr-101',
  name: 'Dr. Radhika Sharma',
  email_hash: 'radhika.sharma@dpsrkp.edu.in',
  role_enum: 'TEACHER',
  institute_id: 'inst-1',
  avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
};

export const mockExams: Exam[] = [
  {
    exam_id: 'exam-101',
    exam_title: 'Class XII - Physics Mid-Term Board Simulation',
    subject: 'Physics (Electrodynamics & Optics)',
    total_marks: 50,
    institute_id: 'inst-1',
    date: '2026-08-28',
    academic_year: '2026-2027',
  },
  {
    exam_id: 'exam-102',
    exam_title: 'Class XI - Advanced Calculus Assessment',
    subject: 'Mathematics',
    total_marks: 60,
    institute_id: 'inst-1',
    date: '2026-09-02',
    academic_year: '2026-2027',
  },
  {
    exam_id: 'exam-103',
    exam_title: 'Class XII - Chemistry Organic Mechanisms',
    subject: 'Chemistry',
    total_marks: 70,
    institute_id: 'inst-1',
    date: '2026-09-04',
    academic_year: '2026-2027',
  },
];

export const mockQuestions: Question[] = [
  {
    question_id: 'q-1',
    exam_id: 'exam-101',
    question_number: 1,
    question_text: 'Using Biot-Savart Law, derive the formula for the magnetic field at the center of a circular coil carrying current I. State units and vector direction.',
    max_marks: 5,
  },
  {
    question_id: 'q-2',
    exam_id: 'exam-101',
    question_number: 2,
    question_text: "State Gauss's Law in electrostatics. Calculate the net electric flux leaving an enclosed closed Gaussian cubical box containing a dipole of charge ±5µC.",
    max_marks: 5,
  },
  {
    question_id: 'q-3',
    exam_id: 'exam-101',
    question_number: 3,
    question_text: 'Explain Total Internal Reflection (TIR). Deduce the mathematical relationship between the critical angle and refractive index with an optical ray diagram.',
    max_marks: 5,
  },
];

export const mockRubrics: Rubric[] = [
  {
    rubric_id: 'rub-1',
    question_id: 'q-1',
    criteria_text: 'Biot-Savart differential equation dB = (µ0/4π) * (I dl sin θ / r^2) stated with vector cross product or angle = 90 deg.',
    weightage_points: 1.5,
    ai_grading_prompt: 'Verify formula contains µ0, 4pi denominator, I dl cross r vector form.',
  },
  {
    rubric_id: 'rub-2',
    question_id: 'q-1',
    criteria_text: 'Integration step over circular perimeter integral(dl) = 2*pi*R with correct cancellation.',
    weightage_points: 2.0,
    ai_grading_prompt: 'Check boundary integration from 0 to 2pi R leading to B = µ0 I / (2 R).',
  },
  {
    rubric_id: 'rub-3',
    question_id: 'q-1',
    criteria_text: 'Direction determined by Right-Hand Thumb Rule and SI Unit (Tesla / T) explicitly specified.',
    weightage_points: 1.5,
    ai_grading_prompt: 'Ensure unit Tesla or Wb/m^2 and Right-Hand Grip Rule is stated.',
  },
  {
    rubric_id: 'rub-4',
    question_id: 'q-2',
    criteria_text: "Gauss's law statement: Total flux = Q_enclosed / epsilon_0.",
    weightage_points: 2.0,
  },
  {
    rubric_id: 'rub-5',
    question_id: 'q-2',
    criteria_text: 'Dipole net charge calculation: Q_net = (+5µC) + (-5µC) = 0.',
    weightage_points: 2.0,
  },
  {
    rubric_id: 'rub-6',
    question_id: 'q-2',
    criteria_text: 'Final conclusion: Net electric flux is Zero (0 N m^2 / C).',
    weightage_points: 1.0,
  },
];

export const mockStudents: Student[] = [
  {
    student_id: 'stu-101',
    name: 'Aarav Saxena',
    roll_number: '12044',
    whatsapp_phone_number: '+91 98765 43210',
    institute_id: 'inst-1',
    grade_section: 'Grade 12-A',
  },
  {
    student_id: 'stu-102',
    name: 'Ananya Verma',
    roll_number: '12045',
    whatsapp_phone_number: '+91 98112 34567',
    institute_id: 'inst-1',
    grade_section: 'Grade 12-A',
  },
  {
    student_id: 'stu-103',
    name: 'Rohan Kulkarni',
    roll_number: '12048',
    whatsapp_phone_number: '+91 99234 56789',
    institute_id: 'inst-1',
    grade_section: 'Grade 12-B',
  },
  {
    student_id: 'stu-104',
    name: 'Priya Nair',
    roll_number: '12052',
    whatsapp_phone_number: '+91 97654 32109',
    institute_id: 'inst-1',
    grade_section: 'Grade 12-B',
  },
];

export const mockBatches: BatchUpload[] = [
  {
    upload_id: 'batch-001',
    exam_id: 'exam-101',
    user_id: 'usr-101',
    batch_name: 'Physics_XIIA_Term1_Scans.zip',
    batch_status: 'AI_GRADED',
    s3_archive_url: 's3://intelligrade-vault/batches/Physics_XIIA_Term1.tar.gz',
    total_sheets: 36,
    processed_sheets: 36,
    uploaded_at: '2026-09-05 14:30',
    processing_step: 'Completed OCR & LLM Evaluator',
  },
  {
    upload_id: 'batch-002',
    exam_id: 'exam-101',
    user_id: 'usr-101',
    batch_name: 'Physics_XIIB_Retest_Sheets.zip',
    batch_status: 'PROCESSING',
    s3_archive_url: 's3://intelligrade-vault/batches/Physics_XIIB_Retest.zip',
    total_sheets: 24,
    processed_sheets: 18,
    uploaded_at: '2026-09-06 19:40',
    processing_step: 'PaddleOCR Vision Engine: Extracting Sheet #19 bounding boxes...',
  },
  {
    upload_id: 'batch-003',
    exam_id: 'exam-102',
    user_id: 'usr-101',
    batch_name: 'Calculus_Midterm_Batch3.zip',
    batch_status: 'QUEUED',
    s3_archive_url: 's3://intelligrade-vault/batches/Calculus_Batch3.zip',
    total_sheets: 40,
    processed_sheets: 0,
    uploaded_at: '2026-09-06 21:50',
    processing_step: 'Queued in Redis Celery worker pool',
  },
];

export const mockAnswerSheets: AnswerSheet[] = [
  {
    sheet_id: 'sheet-101',
    batch_upload_id: 'batch-001',
    student_id: 'stu-101',
    extracted_student_roll: '12044',
    s3_pdf_url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&auto=format&fit=crop&q=80',
    page_count: 3,
    status: 'AI_GRADED',
    uploaded_at: '2026-09-05 14:32',
  },
  {
    sheet_id: 'sheet-102',
    batch_upload_id: 'batch-001',
    student_id: 'stu-102',
    extracted_student_roll: '12045',
    s3_pdf_url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&auto=format&fit=crop&q=80',
    page_count: 3,
    status: 'TEACHER_REVIEWED',
    uploaded_at: '2026-09-05 14:35',
  },
  {
    sheet_id: 'sheet-103',
    batch_upload_id: 'batch-001',
    student_id: 'stu-103',
    extracted_student_roll: '12048',
    s3_pdf_url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&auto=format&fit=crop&q=80',
    page_count: 3,
    status: 'PUBLISHED',
    uploaded_at: '2026-09-05 14:38',
  },
];

export const mockOCRPage1: OCRPage = {
  page_id: 'ocr-pg-1',
  sheet_id: 'sheet-101',
  page_number: 1,
  full_text_content: `Roll No: 12044 | Student: Aarav Saxena | Subject: Physics XII
Q1. According to Biot-Savart Law, the small magnetic field dB produced by an element dl carrying current I at distance r is given by:
dB = (µ0 / 4π) * (I dl × r̂) / r²
For a circular coil of radius R:
Angle between dl and radius vector is 90° -> sin 90° = 1.
Integrating over full circular perimeter:
B = ∫ dB = (µ0 I / 4π R²) ∫ dl
Since ∫ dl = 2π R (circumference of loop):
B = (µ0 I / 4π R²) * 2π R
=> B = µ0 I / (2 R).
Direction: Right-Hand Thumb Rule (perpendicular to coil plane). Unit is Tesla.

Q2. Gauss's Law states that total electric flux Φ through a closed surface is equal to Q_enclosed / ε0.
For a dipole enclosed inside a cube:
Total enclosed charge Q_enc = (+5 µC) + (-5 µC) = 0.
Therefore, net electric flux Φ = 0 / ε0 = 0 N·m²/C.`,
  image_preview_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&auto=format&fit=crop&q=80',
  bounding_boxes: [
    {
      box_id: 'box-1',
      page_id: 'ocr-pg-1',
      question_id: 'q-1',
      coordinates: { x: 5, y: 8, width: 90, height: 7 },
      detected_text: 'Roll No: 12044 | Student: Aarav Saxena | Subject: Physics XII',
      confidence_score: 0.98,
      line_index: 1,
    },
    {
      box_id: 'box-2',
      page_id: 'ocr-pg-1',
      question_id: 'q-1',
      coordinates: { x: 5, y: 17, width: 88, height: 8 },
      detected_text: 'dB = (µ0 / 4π) * (I dl × r̂) / r²  [Biot Savart Law Vector Form]',
      confidence_score: 0.96,
      line_index: 2,
    },
    {
      box_id: 'box-3',
      page_id: 'ocr-pg-1',
      question_id: 'q-1',
      coordinates: { x: 5, y: 27, width: 85, height: 9 },
      detected_text: 'Angle between dl and radius is 90° => sin 90° = 1',
      confidence_score: 0.94,
      line_index: 3,
    },
    {
      box_id: 'box-4',
      page_id: 'ocr-pg-1',
      question_id: 'q-1',
      coordinates: { x: 5, y: 38, width: 82, height: 10 },
      detected_text: 'B = ∫ dB = (µ0 I / 4π R²) * (2π R) = µ0 I / (2 R)',
      confidence_score: 0.97,
      line_index: 4,
    },
    {
      box_id: 'box-5',
      page_id: 'ocr-pg-1',
      question_id: 'q-1',
      coordinates: { x: 5, y: 50, width: 80, height: 7 },
      detected_text: 'Direction: Right Hand Grip Rule (perpendicular to coil). Unit: Tesla.',
      confidence_score: 0.93,
      line_index: 5,
    },
    {
      box_id: 'box-6',
      page_id: 'ocr-pg-1',
      question_id: 'q-2',
      coordinates: { x: 5, y: 62, width: 90, height: 9 },
      detected_text: "Q2. Gauss's Law: Φ = ∮ E·dA = Q_enclosed / ε0",
      confidence_score: 0.95,
      line_index: 6,
    },
    {
      box_id: 'box-7',
      page_id: 'ocr-pg-1',
      question_id: 'q-2',
      coordinates: { x: 5, y: 73, width: 88, height: 9 },
      detected_text: 'Dipole: Q_enclosed = (+5 µC) + (-5 µC) = 0 µC',
      confidence_score: 0.99,
      line_index: 7,
    },
    {
      box_id: 'box-8',
      page_id: 'ocr-pg-1',
      question_id: 'q-2',
      coordinates: { x: 5, y: 84, width: 85, height: 8 },
      detected_text: 'Net electric flux Φ = 0 / ε0 = 0 N·m²/C',
      confidence_score: 0.97,
      line_index: 8,
    },
  ],
};

export const mockResults: Result[] = [
  {
    result_id: 'res-101',
    sheet_id: 'sheet-101',
    exam_id: 'exam-101',
    student_id: 'stu-101',
    final_score: 46.5,
    total_marks: 50,
    percentage: 93,
    grade_letter: 'A1',
    overall_feedback: 'Outstanding grasp of electrodynamics fundamentals. Derivations are rigorous, neatly structured, and mathematically verified. Highly commendable work on boundary conditions.',
    status: 'AI_GRADED',
    s3_report_url: 'https://intelligrade.s3.amazonaws.com/reports/12044_Physics_Scorecard.pdf',
    evaluation_items: [
      {
        eval_item_id: 'eval-1',
        result_id: 'res-101',
        question_id: 'q-1',
        rubric_id: 'rub-1',
        marks_awarded: 4.5,
        max_marks: 5,
        ai_justification: 'Accurate Biot-Savart vector formulation and step-by-step circular loop integration. Full marks for derivation. Deducted 0.5 for slightly brief right-hand rule explanation.',
        key_positives: [
          'Vector cross product formula explicitly stated',
          'Integration limits (0 to 2πR) clearly applied',
          'Final algebraic simplification B = µ0 I / 2R is flawless',
        ],
        key_gaps: ['Could have explicitly sketched current arrow orientation on the circular loop perimeter.'],
        is_overridden: false,
      },
      {
        eval_item_id: 'eval-2',
        result_id: 'res-101',
        question_id: 'q-2',
        rubric_id: 'rub-4',
        marks_awarded: 5.0,
        max_marks: 5,
        ai_justification: "Perfect execution. Complete definition of Gauss's Law followed by algebraic demonstration that dipole total charge = 0, proving flux is zero.",
        key_positives: [
          'Correct surface integral formula with vector notation',
          'Accurate zero flux conclusion with SI units (N m^2 / C)',
        ],
        key_gaps: [],
        is_overridden: false,
      },
      {
        eval_item_id: 'eval-3',
        result_id: 'res-101',
        question_id: 'q-3',
        rubric_id: 'rub-1',
        marks_awarded: 4.5,
        max_marks: 5,
        ai_justification: 'Both conditions for TIR clearly enumerated. Snell law applied at critical angle 90 degrees with correct reciprocal relation.',
        key_positives: ['Dual conditions for TIR verified', 'Correct trigonometric deduction 1/sin(C)'],
        key_gaps: ['Ray diagram was slightly faint in scanned image, though mathematically verified.'],
        is_overridden: false,
      },
    ],
  },
  {
    result_id: 'res-102',
    sheet_id: 'sheet-102',
    exam_id: 'exam-101',
    student_id: 'stu-102',
    final_score: 48.0,
    total_marks: 50,
    percentage: 96,
    grade_letter: 'A1+',
    overall_feedback: 'Exceptional handwritten submission. Neat optical ray diagrams and comprehensive mathematical justifications.',
    status: 'TEACHER_REVIEWED',
    approved_by_user_id: 'usr-101',
    approved_at: '2026-09-06 11:20',
    s3_report_url: 'https://intelligrade.s3.amazonaws.com/reports/12045_Physics_Scorecard.pdf',
    evaluation_items: [
      {
        eval_item_id: 'eval-4',
        result_id: 'res-102',
        question_id: 'q-1',
        rubric_id: 'rub-1',
        marks_awarded: 5.0,
        max_marks: 5,
        ai_justification: 'Flawless derivation including diagram with magnetic field orientation.',
        key_positives: ['Comprehensive diagram', 'Precise unit specification'],
        key_gaps: [],
        teacher_marks: 5.0,
        teacher_notes: 'Verified by Dr. Radhika Sharma. Masterclass presentation.',
        is_overridden: true,
      },
    ],
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    log_id: 'log-501',
    result_id: 'res-102',
    question_id: 'q-1',
    user_id: 'usr-101',
    user_name: 'Dr. Radhika Sharma',
    change_type: 'MARKS_OVERRIDE',
    old_marks: 4.5,
    new_marks: 5.0,
    reason: 'Student provided an additional neat cross-sectional field line sketch justifying complete 5.0 marks.',
    timestamp: '2026-09-06 11:15',
  },
  {
    log_id: 'log-502',
    result_id: 'res-102',
    question_id: 'q-all',
    user_id: 'usr-101',
    user_name: 'Dr. Radhika Sharma',
    change_type: 'STATUS_APPROVE',
    old_marks: 48,
    new_marks: 48,
    reason: 'Teacher approved final scorecard for branded PDF generation and parent WhatsApp dispatch.',
    timestamp: '2026-09-06 11:20',
  },
];

export const mockWhatsAppLogs: WhatsAppDeliveryLog[] = [
  {
    delivery_id: 'wa-901',
    result_id: 'res-102',
    student_id: 'stu-102',
    student_name: 'Ananya Verma',
    roll_number: '12045',
    whatsapp_phone_number: '+91 98112 34567',
    message_id_external: 'wamid.HBgMOTE5ODExMjM0NTY3FQIAERgSM0VGOUVCNUM5',
    delivery_status: 'READ',
    dispatched_at: '2026-09-06 11:22',
    delivered_at: '2026-09-06 11:22',
    read_at: '2026-09-06 11:25',
    payload_summary: 'Dear Parent, Physics Term 1 scorecard for Ananya Verma (Roll: 12045) is ready: 48/50 (96%). Tap to view official verified report.',
  },
  {
    delivery_id: 'wa-902',
    result_id: 'res-103',
    student_id: 'stu-103',
    student_name: 'Rohan Kulkarni',
    roll_number: '12048',
    whatsapp_phone_number: '+91 99234 56789',
    message_id_external: 'wamid.HBgMOTE5OTIzNDU2Nzg5FQIAERgSREE1ODIzMzg1',
    delivery_status: 'DELIVERED',
    dispatched_at: '2026-09-06 11:30',
    delivered_at: '2026-09-06 11:31',
    payload_summary: 'Dear Parent, Physics Term 1 scorecard for Rohan Kulkarni (Roll: 12048) is ready: 41/50 (82%). Tap to view verified report.',
  },
  {
    delivery_id: 'wa-903',
    result_id: 'res-101',
    student_id: 'stu-101',
    student_name: 'Aarav Saxena',
    roll_number: '12044',
    whatsapp_phone_number: '+91 98765 43210',
    message_id_external: 'wamid.HBgMOTE5ODc2NTQzMjEwFQIAERgSODFDNThGMDM3',
    delivery_status: 'QUEUED',
    dispatched_at: '2026-09-06 21:55',
    payload_summary: 'Ready for dispatch upon Teacher Review approval.',
  },
];
