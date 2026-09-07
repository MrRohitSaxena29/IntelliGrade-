package com.intelligrade.service;

import com.intelligrade.entity.*;
import com.intelligrade.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataInitializerService implements CommandLineRunner {

    private final InstituteRepository instituteRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final RubricRepository rubricRepository;
    private final BatchUploadRepository batchUploadRepository;
    private final AnswerSheetRepository answerSheetRepository;
    private final OCRPageRepository ocrPageRepository;
    private final OCRBoundingBoxRepository boundingBoxRepository;
    private final ResultRepository resultRepository;
    private final EvaluationItemRepository evaluationItemRepository;
    private final AuditLogRepository auditLogRepository;
    private final WhatsAppDeliveryLogRepository whatsAppDeliveryLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("IntelliGrade database already contains users. Skipping initial seed.");
            return;
        }

        log.info("Seeding initial IntelliGrade database with sample academic dataset...");

        // 1. Institutes
        Institute inst1 = Institute.builder()
                .instituteId("inst-1")
                .name("Delhi Public School, R.K. Puram")
                .brandingLogoUrl("https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80")
                .primaryColor("#4f46e5")
                .accentColor("#06b6d4")
                .tagline("Service Before Self • Accredited CBSE Center")
                .whatsappApiConfigJson("{\"senderPhoneId\": \"PHONE_DPS_9101\", \"templateNamespace\": \"dps_intelligrade_reports\", \"webhookVerified\": true}")
                .build();
        instituteRepository.save(inst1);

        // 2. Users
        String encodedPassword = passwordEncoder.encode("password123");
        User teacher = User.builder()
                .userId("usr-101")
                .instituteId("inst-1")
                .name("Dr. Radhika Sharma")
                .email("radhika.sharma@dpsrkp.edu.in")
                .passwordHash(encodedPassword)
                .roleEnum("TEACHER")
                .avatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80")
                .build();
        userRepository.save(teacher);

        User admin = User.builder()
                .userId("usr-102")
                .instituteId("inst-1")
                .name("Principal Rajesh Malhotra")
                .email("admin@dpsrkp.edu.in")
                .passwordHash(encodedPassword)
                .roleEnum("ADMIN")
                .avatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80")
                .build();
        userRepository.save(admin);

        User prof = User.builder()
                .userId("usr-103")
                .instituteId("inst-1")
                .name("Dr. Aris Thorne")
                .email("prof.aris@university.edu")
                .passwordHash(encodedPassword)
                .roleEnum("LEAD_PROFESSOR")
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80")
                .build();
        userRepository.save(prof);

        // 3. Students
        Student stu1 = Student.builder()
                .studentId("stu-101")
                .instituteId("inst-1")
                .name("Aarav Saxena")
                .rollNumber("12044")
                .whatsappPhoneNumber("+91 98765 43210")
                .gradeSection("Grade 12-A")
                .build();
        studentRepository.save(stu1);

        Student stu2 = Student.builder()
                .studentId("stu-102")
                .instituteId("inst-1")
                .name("Ananya Verma")
                .rollNumber("12045")
                .whatsappPhoneNumber("+91 98112 34567")
                .gradeSection("Grade 12-A")
                .build();
        studentRepository.save(stu2);

        // 4. Exams
        Exam exam1 = Exam.builder()
                .examId("exam-101")
                .instituteId("inst-1")
                .examTitle("Class XII - Physics Mid-Term Board Simulation")
                .subject("Physics (Electrodynamics & Optics)")
                .totalMarks(50.0)
                .date(LocalDate.of(2026, 8, 28))
                .academicYear("2026-2027")
                .build();
        examRepository.save(exam1);

        Exam exam2 = Exam.builder()
                .examId("exam-102")
                .instituteId("inst-1")
                .examTitle("Class XI - Advanced Calculus Assessment")
                .subject("Mathematics")
                .totalMarks(60.0)
                .date(LocalDate.of(2026, 9, 2))
                .academicYear("2026-2027")
                .build();
        examRepository.save(exam2);

        // 5. Questions
        Question q1 = Question.builder()
                .questionId("q-1")
                .examId("exam-101")
                .questionNumber(1)
                .questionText("Using Biot-Savart Law, derive the formula for the magnetic field at the center of a circular coil carrying current I. State units and vector direction.")
                .maxMarks(5.0)
                .build();
        questionRepository.save(q1);

        Question q2 = Question.builder()
                .questionId("q-2")
                .examId("exam-101")
                .questionNumber(2)
                .questionText("State Gauss's Law in electrostatics. Calculate the net electric flux leaving an enclosed closed Gaussian cubical box containing a dipole of charge ±5µC.")
                .maxMarks(5.0)
                .build();
        questionRepository.save(q2);

        // 6. Rubrics
        Rubric r1 = Rubric.builder()
                .rubricId("rub-1")
                .questionId("q-1")
                .criteriaText("Biot-Savart differential equation dB = (µ0/4π) * (I dl sin θ / r^2) stated with vector cross product.")
                .weightagePoints(1.5)
                .aiGradingPrompt("Verify formula contains µ0, 4pi denominator, I dl cross r vector form.")
                .build();
        rubricRepository.save(r1);

        Rubric r2 = Rubric.builder()
                .rubricId("rub-2")
                .questionId("q-1")
                .criteriaText("Integration step over circular perimeter integral(dl) = 2*pi*R with correct cancellation.")
                .weightagePoints(2.0)
                .aiGradingPrompt("Check boundary integration from 0 to 2pi R leading to B = µ0 I / (2 R).")
                .build();
        rubricRepository.save(r2);

        Rubric r3 = Rubric.builder()
                .rubricId("rub-3")
                .questionId("q-1")
                .criteriaText("Direction determined by Right-Hand Thumb Rule and SI Unit (Tesla) explicitly specified.")
                .weightagePoints(1.5)
                .aiGradingPrompt("Ensure unit Tesla or Wb/m^2 and Right-Hand Grip Rule is stated.")
                .build();
        rubricRepository.save(r3);

        Rubric r4 = Rubric.builder()
                .rubricId("rub-4")
                .questionId("q-2")
                .criteriaText("Gauss's law statement: Total flux = Q_enclosed / epsilon_0.")
                .weightagePoints(2.0)
                .aiGradingPrompt("Check definition and formula with epsilon_0.")
                .build();
        rubricRepository.save(r4);

        Rubric r5 = Rubric.builder()
                .rubricId("rub-5")
                .questionId("q-2")
                .criteriaText("Dipole net charge calculation: Q_net = (+5µC) + (-5µC) = 0.")
                .weightagePoints(2.0)
                .aiGradingPrompt("Verify total dipole charge sums to zero.")
                .build();
        rubricRepository.save(r5);

        Rubric r6 = Rubric.builder()
                .rubricId("rub-6")
                .questionId("q-2")
                .criteriaText("Final conclusion: Net electric flux is Zero (0 N m^2 / C).")
                .weightagePoints(1.0)
                .aiGradingPrompt("Check zero flux with correct SI units.")
                .build();
        rubricRepository.save(r6);

        // 7. Batch Uploads
        BatchUpload batch1 = BatchUpload.builder()
                .uploadId("batch-001")
                .examId("exam-101")
                .userId("usr-101")
                .batchName("Physics_XIIA_Term1_Scans.zip")
                .batchStatus("AI_GRADED")
                .s3ArchiveUrl("s3://intelligrade-vault/batches/Physics_XIIA_Term1.tar.gz")
                .totalSheets(36)
                .processedSheets(36)
                .processingStep("Completed OCR & LLM Evaluator")
                .uploadedAt(LocalDateTime.now().minusDays(2))
                .build();
        batchUploadRepository.save(batch1);

        BatchUpload batch2 = BatchUpload.builder()
                .uploadId("batch-002")
                .examId("exam-101")
                .userId("usr-101")
                .batchName("Physics_XIIB_Retest_Sheets.zip")
                .batchStatus("PROCESSING")
                .s3ArchiveUrl("s3://intelligrade-vault/batches/Physics_XIIB_Retest.zip")
                .totalSheets(24)
                .processedSheets(18)
                .processingStep("PaddleOCR Vision Engine: Extracting Sheet #19 bounding boxes...")
                .uploadedAt(LocalDateTime.now().minusHours(16))
                .build();
        batchUploadRepository.save(batch2);

        // 8. Answer Sheets
        AnswerSheet sheet1 = AnswerSheet.builder()
                .sheetId("sheet-101")
                .batchUploadId("batch-001")
                .studentId("stu-101")
                .extractedStudentRoll("12044")
                .s3PdfUrl("https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&auto=format&fit=crop&q=80")
                .pageCount(3)
                .status("AI_GRADED")
                .uploadedAt(LocalDateTime.now().minusDays(2))
                .build();
        answerSheetRepository.save(sheet1);

        AnswerSheet sheet2 = AnswerSheet.builder()
                .sheetId("sheet-102")
                .batchUploadId("batch-001")
                .studentId("stu-102")
                .extractedStudentRoll("12045")
                .s3PdfUrl("https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&auto=format&fit=crop&q=80")
                .pageCount(3)
                .status("TEACHER_REVIEWED")
                .uploadedAt(LocalDateTime.now().minusDays(2))
                .build();
        answerSheetRepository.save(sheet2);

        // 9. OCR Pages & Bounding Boxes
        OCRPage ocrPg1 = OCRPage.builder()
                .pageId("ocr-pg-1")
                .sheetId("sheet-101")
                .pageNumber(1)
                .fullTextContent("Roll No: 12044 | Student: Aarav Saxena | Subject: Physics XII\nQ1. According to Biot-Savart Law, dB = (µ0 / 4π) * (I dl × r̂) / r²\nIntegrating over full perimeter: B = (µ0 I / 4π R²) * 2π R => B = µ0 I / (2 R).\nDirection: Right-Hand Thumb Rule. Unit is Tesla.\nQ2. Gauss's Law states Φ = Q_enc / ε0. Dipole enclosed has Q_enc = (+5) + (-5) = 0. Therefore Φ = 0 N·m²/C.")
                .imagePreviewUrl("https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&auto=format&fit=crop&q=80")
                .build();
        ocrPageRepository.save(ocrPg1);

        boundingBoxRepository.save(OCRBoundingBox.builder()
                .boxId("box-1")
                .pageId("ocr-pg-1")
                .questionId("q-1")
                .coordX(5.0).coordY(8.0).coordWidth(90.0).coordHeight(7.0)
                .detectedText("Roll No: 12044 | Student: Aarav Saxena | Subject: Physics XII")
                .confidenceScore(0.98)
                .lineIndex(1)
                .build());

        boundingBoxRepository.save(OCRBoundingBox.builder()
                .boxId("box-2")
                .pageId("ocr-pg-1")
                .questionId("q-1")
                .coordX(5.0).coordY(18.0).coordWidth(88.0).coordHeight(8.0)
                .detectedText("dB = (µ0 / 4π) * (I dl × r̂) / r²  [Biot Savart Law Vector Form]")
                .confidenceScore(0.96)
                .lineIndex(2)
                .build());

        boundingBoxRepository.save(OCRBoundingBox.builder()
                .boxId("box-3")
                .pageId("ocr-pg-1")
                .questionId("q-1")
                .coordX(5.0).coordY(38.0).coordWidth(82.0).coordHeight(10.0)
                .detectedText("B = ∫ dB = (µ0 I / 4π R²) * (2π R) = µ0 I / (2 R)")
                .confidenceScore(0.97)
                .lineIndex(3)
                .build());

        boundingBoxRepository.save(OCRBoundingBox.builder()
                .boxId("box-4")
                .pageId("ocr-pg-1")
                .questionId("q-2")
                .coordX(5.0).coordY(62.0).coordWidth(90.0).coordHeight(9.0)
                .detectedText("Q2. Gauss's Law: Φ = ∮ E·dA = Q_enclosed / ε0")
                .confidenceScore(0.95)
                .lineIndex(4)
                .build());

        // 10. Results & Evaluation Items
        Result res1 = Result.builder()
                .resultId("res-101")
                .sheetId("sheet-101")
                .examId("exam-101")
                .studentId("stu-101")
                .finalScore(46.5)
                .totalMarks(50.0)
                .percentage(93.0)
                .gradeLetter("A1")
                .overallFeedback("Outstanding grasp of electrodynamics fundamentals. Derivations are rigorous, neatly structured, and mathematically verified.")
                .status("AI_GRADED")
                .s3ReportUrl("https://intelligrade.s3.amazonaws.com/reports/12044_Physics_Scorecard.pdf")
                .build();
        resultRepository.save(res1);

        EvaluationItem item1 = EvaluationItem.builder()
                .evalItemId("eval-1")
                .result(res1)
                .questionId("q-1")
                .rubricId("rub-1")
                .marksAwarded(4.5)
                .maxMarks(5.0)
                .aiJustification("Accurate Biot-Savart vector formulation and step-by-step circular loop integration. Full marks for derivation. Deducted 0.5 for slightly brief right-hand rule explanation.")
                .keyPositivesJson("[\"Vector cross product formula explicitly stated\", \"Integration limits (0 to 2πR) clearly applied\", \"Final algebraic simplification B = µ0 I / 2R is flawless\"]")
                .keyGapsJson("[\"Could have explicitly sketched current arrow orientation on the circular loop perimeter.\"]")
                .isOverridden(false)
                .build();
        evaluationItemRepository.save(item1);

        EvaluationItem item2 = EvaluationItem.builder()
                .evalItemId("eval-2")
                .result(res1)
                .questionId("q-2")
                .rubricId("rub-4")
                .marksAwarded(5.0)
                .maxMarks(5.0)
                .aiJustification("Perfect execution. Complete definition of Gauss's Law followed by algebraic demonstration that dipole total charge = 0, proving flux is zero.")
                .keyPositivesJson("[\"Correct surface integral formula with vector notation\", \"Accurate zero flux conclusion with SI units (N m^2 / C)\"]")
                .keyGapsJson("[]")
                .isOverridden(false)
                .build();
        evaluationItemRepository.save(item2);

        // 11. Audit Logs
        AuditLog log1 = AuditLog.builder()
                .logId("log-1")
                .resultId("res-101")
                .questionId("Q1")
                .userId("usr-101")
                .userName("Dr. Aris Thorne")
                .changeType("MARKS_OVERRIDE")
                .oldMarks(44.0)
                .newMarks(46.5)
                .reason("Awarded +2.5 marks after manual inspection: Student gave valid alternative cross-product notation.")
                .createdAt(LocalDateTime.now().minusHours(4))
                .build();
        auditLogRepository.save(log1);

        // 12. WhatsApp Delivery Logs
        WhatsAppDeliveryLog wa1 = WhatsAppDeliveryLog.builder()
                .deliveryId("disp-101")
                .resultId("res-101")
                .studentId("stu-101")
                .studentName("Aarav Sharma")
                .rollNumber("21CS101")
                .whatsappPhoneNumber("+91 98765 43210")
                .messageIdExternal("wamid.HBgLMjA5NTg3NTUzNzQ4FQIAERgSMzAyNDNBMjA3RDE3NjQzQ0Y0AA==")
                .deliveryStatus("DELIVERED")
                .payloadSummary("Physics Midterm Evaluation Scorecard - 93.0%")
                .dispatchedAt(LocalDateTime.now().minusHours(2))
                .deliveredAt(LocalDateTime.now().minusHours(2).plusMinutes(1))
                .readAt(LocalDateTime.now().minusHours(2).plusMinutes(5))
                .build();
        whatsAppDeliveryLogRepository.save(wa1);

        log.info("IntelliGrade seed data initialized successfully! Ready for AI evaluation pipeline.");
    }
}
