# IntelliGrade Frontend — Completion Walkthrough

The complete frontend application for **IntelliGrade: AI Answer Sheet Evaluation System** has been built, tested, and deployed to a local development server.

---

## 1. Architectural & Functional Modules Implemented

### 🏢 Multi-Tenant Institute & Role Engine
- **Tenant Switcher**: Switch between *Delhi Public School, R.K. Puram*, *Apex IIT Academy*, and *St. Xavier International School*. Primary and accent theme colors dynamically update across the entire interface.
- **User Roles**: Seamlessly toggle between `TEACHER`, `ADMIN`, and `EVALUATOR` to simulate institutional permissions.

### 📊 Dashboard & 7-Stage Pipeline Tracker
- **Real-Time KPIs**: Total Ingested Sheets, AI Evaluation Accuracy (98.4%), Teacher Reviews Pending, and WhatsApp Delivery Rate.
- **Pipeline Visualizer**: An interactive step tracker reflecting the project's operational workflow:
  1. *Ingestion Phase* (PDF Uploads)
  2. *Async Engine* (Redis MQ)
  3. *CV & OCR Engine* (PaddleOCR)
  4. *GenAI Evaluation* (LLM Agent)
  5. *Human-in-the-Loop* (Teacher Calibration)
  6. *Branded Scorecards* (PDF Generation)
  7. *WhatsApp Delivery* (Meta Cloud API)
- **Batch Processing Table**: Live batch monitoring with progress bars, status badges (`QUEUED`, `PROCESSING`, `AI_GRADED`, `TEACHER_REVIEWED`, `PUBLISHED`), and direct action buttons.

### 📐 Academic Exams & Rubric Designer
- **Exam Management**: List exams by discipline, total marks, and academic year. Includes an **Exam Create Modal** to add new assessments.
- **Step-Wise Rubric Editor**: Define question-level rubric criteria, points allocation, and custom AI prompt instructions. Validates that allocated criteria points match the question maximum marks.

### 🔍 Ingestion & Computer Vision OCR Inspector
- **Batch Upload Zone**: Drag-and-drop ingestion area with automated progression simulation from Redis queue to character extraction.
- **PaddleOCR Bounding Box Inspector**: Split-view visualizer displaying scanned student handwriting overlaid with dashed bounding boxes, line coordinates, and confidence scores (94% - 98%).

### ✍️ Human-in-the-Loop Evaluation Studio (Core Feature)
- **Dual-Pane Split Workspace**:
  - **Left Pane (Sheet Viewer)**: High-resolution scanned answer sheet with zoom/pan controls, question boundary highlights, and OCR overlay toggle.
  - **Right Pane (Score Adjustment)**:
    - Question navigation tabs (Q1, Q2, Q3) with real-time score indicators.
    - AI Justification breakdown: Displays verified strengths and deduction gaps against rubric criteria.
    - Teacher Override Controller: Allows teachers to adjust marks, automatically enforces a rationale note, and logs the change to `AUDIT_LOGS`.
- **Approval Flow**: "Approve & Mark Verified" button locks scores and celebrates with a confetti explosion (`canvas-confetti`).

### 🎓 Official Branded Student Scorecard
- **Accreditation-Ready Design**: Features the institute logo, school tagline, CBSE verification stamp, student roll number, and class metadata.
- **Performance Breakdown**: Displays aggregate percentage, letter grade, question-by-question marks table, and qualitative remarks.
- **Verification QR Code**: Tamper-evident verification token for parent/board authentication.
- **Print Optimization**: Native `@media print` styling removes navigation bars and formats the report card cleanly for PDF export or paper printing.

### 📱 WhatsApp Automated Distribution Tracker
- **Meta Cloud API Monitor**: Live outbound dispatch logs showing recipient phone numbers, message IDs, and delivery lifecycle states (`QUEUED`, `SENT`, `DELIVERED`, `READ`).
- **Interactive Chat Preview**: Realistic phone modal showing how parents receive their student's official scorecard link in WhatsApp.

### 🛡️ Institutional Audit Trail
- **Compliance Logging**: Automatically records every score override, old score vs new score, delta, timestamp, and teacher justification.

---

## 2. Verification & Build Results

### Automated Build Verification
```bash
> frontend@0.0.0 build
> tsc -b && vite build

vite v8.2.2 building client environment for production...
✓ 1856 modules transformed.
dist/index.html                   1.22 kB │ gzip:  0.67 kB
dist/assets/index-S3lUlW-V.css    7.71 kB │ gzip:  2.37 kB
dist/assets/index-CVIGdVdK.js   318.76 kB │ gzip: 91.20 kB
✓ built in 559ms with 0 errors
```

### Dev Server Health
- **URL**: `http://localhost:5173/`
- **HTTP Status**: `200 OK`
- **Vite State**: Running as daemon in background.
