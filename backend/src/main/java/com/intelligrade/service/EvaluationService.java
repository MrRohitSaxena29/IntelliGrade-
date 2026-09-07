package com.intelligrade.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.intelligrade.dto.EvaluationDto;
import com.intelligrade.entity.*;
import com.intelligrade.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final AnswerSheetRepository answerSheetRepository;
    private final StudentRepository studentRepository;
    private final ExamRepository examRepository;
    private final OCRPageRepository ocrPageRepository;
    private final OCRBoundingBoxRepository boundingBoxRepository;
    private final ResultRepository resultRepository;
    private final EvaluationItemRepository evaluationItemRepository;
    private final BatchUploadRepository batchUploadRepository;
    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public EvaluationDto.SheetEvaluationResponse getSheetEvaluation(String sheetId) {
        AnswerSheet sheet = answerSheetRepository.findById(sheetId)
                .orElseThrow(() -> new IllegalArgumentException("Answer sheet not found: " + sheetId));

        Student student = null;
        if (sheet.getStudentId() != null) {
            student = studentRepository.findById(sheet.getStudentId()).orElse(null);
        }

        Result result = resultRepository.findBySheetId(sheetId).orElse(null);

        String examId = null;
        String examTitle = "Assessment";
        if (result != null) {
            examId = result.getExamId();
        } else {
            BatchUpload batch = batchUploadRepository.findById(sheet.getBatchUploadId()).orElse(null);
            if (batch != null) {
                examId = batch.getExamId();
            }
        }

        if (examId != null) {
            Exam exam = examRepository.findById(examId).orElse(null);
            if (exam != null) {
                examTitle = exam.getExamTitle();
            }
        }

        // OCR Pages and Bounding Boxes
        List<OCRPage> ocrPages = ocrPageRepository.findBySheetIdOrderByPageNumberAsc(sheetId);
        List<EvaluationDto.OCRPageDto> pageDtos = ocrPages.stream().map(pg -> {
            List<OCRBoundingBox> boxes = boundingBoxRepository.findByPageIdOrderByLineIndexAsc(pg.getPageId());
            List<EvaluationDto.BoundingBoxDto> boxDtos = boxes.stream().map(b ->
                    EvaluationDto.BoundingBoxDto.builder()
                            .boxId(b.getBoxId())
                            .questionId(b.getQuestionId())
                            .coordX(b.getCoordX())
                            .coordY(b.getCoordY())
                            .coordWidth(b.getCoordWidth())
                            .coordHeight(b.getCoordHeight())
                            .detectedText(b.getDetectedText())
                            .confidenceScore(b.getConfidenceScore())
                            .lineIndex(b.getLineIndex())
                            .build()
            ).collect(Collectors.toList());

            return EvaluationDto.OCRPageDto.builder()
                    .pageId(pg.getPageId())
                    .pageNumber(pg.getPageNumber())
                    .fullTextContent(pg.getFullTextContent())
                    .imagePreviewUrl(pg.getImagePreviewUrl())
                    .boundingBoxes(boxDtos)
                    .build();
        }).collect(Collectors.toList());

        // Result and Evaluation Items
        EvaluationDto.ResultDetailDto resultDto = null;
        if (result != null) {
            List<EvaluationItem> items = evaluationItemRepository.findByResult_ResultId(result.getResultId());
            List<EvaluationDto.EvaluationItemDto> itemDtos = items.stream().map(item ->
                    EvaluationDto.EvaluationItemDto.builder()
                            .evalItemId(item.getEvalItemId())
                            .questionId(item.getQuestionId())
                            .rubricId(item.getRubricId())
                            .marksAwarded(item.getMarksAwarded())
                            .maxMarks(item.getMaxMarks())
                            .aiJustification(item.getAiJustification())
                            .keyPositives(parseJsonStringList(item.getKeyPositivesJson()))
                            .keyGaps(parseJsonStringList(item.getKeyGapsJson()))
                            .teacherMarks(item.getTeacherMarks())
                            .teacherNotes(item.getTeacherNotes())
                            .isOverridden(item.getIsOverridden())
                            .build()
            ).collect(Collectors.toList());

            resultDto = EvaluationDto.ResultDetailDto.builder()
                    .resultId(result.getResultId())
                    .sheetId(result.getSheetId())
                    .examId(result.getExamId())
                    .studentId(result.getStudentId())
                    .finalScore(result.getFinalScore())
                    .totalMarks(result.getTotalMarks())
                    .percentage(result.getPercentage())
                    .gradeLetter(result.getGradeLetter())
                    .overallFeedback(result.getOverallFeedback())
                    .status(result.getStatus())
                    .s3ReportUrl(result.getS3ReportUrl())
                    .approvedByUserId(result.getApprovedByUserId())
                    .approvedAt(result.getApprovedAt())
                    .items(itemDtos)
                    .build();
        }

        EvaluationDto.StudentDto studentDto = null;
        if (student != null) {
            studentDto = EvaluationDto.StudentDto.builder()
                    .studentId(student.getStudentId())
                    .name(student.getName())
                    .rollNumber(student.getRollNumber())
                    .gradeSection(student.getGradeSection())
                    .whatsappPhoneNumber(student.getWhatsappPhoneNumber())
                    .build();
        }

        return EvaluationDto.SheetEvaluationResponse.builder()
                .sheetId(sheet.getSheetId())
                .examId(examId)
                .examTitle(examTitle)
                .student(studentDto)
                .s3PdfUrl(sheet.getS3PdfUrl())
                .pageCount(sheet.getPageCount())
                .status(sheet.getStatus())
                .uploadedAt(sheet.getUploadedAt())
                .pages(pageDtos)
                .result(resultDto)
                .build();
    }

    @Transactional
    public EvaluationDto.SheetEvaluationResponse overrideMarks(String resultId, EvaluationDto.OverrideMarksRequest req) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new IllegalArgumentException("Result not found: " + resultId));

        Double priorFinalScore = result.getFinalScore();

        List<EvaluationItem> items = evaluationItemRepository.findByResult_ResultId(resultId);
        EvaluationItem targetItem = items.stream()
                .filter(i -> i.getQuestionId().equalsIgnoreCase(req.getQuestionId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Question " + req.getQuestionId() + " not found in result"));

        targetItem.setTeacherMarks(req.getTeacherMarks());
        targetItem.setTeacherNotes(req.getTeacherNotes());
        targetItem.setIsOverridden(true);
        targetItem.setUpdatedAt(LocalDateTime.now());
        evaluationItemRepository.save(targetItem);

        // Recalculate result totals
        double newTotal = items.stream()
                .mapToDouble(i -> {
                    if (i.getEvalItemId().equals(targetItem.getEvalItemId())) {
                        return req.getTeacherMarks();
                    }
                    return (i.getTeacherMarks() != null) ? i.getTeacherMarks() : i.getMarksAwarded();
                })
                .sum();

        result.setFinalScore(newTotal);
        double percentage = (result.getTotalMarks() > 0) ? (newTotal / result.getTotalMarks()) * 100.0 : 0.0;
        result.setPercentage(Math.round(percentage * 10.0) / 10.0);
        result.setGradeLetter(calculateGrade(result.getPercentage()));
        result.setStatus("TEACHER_REVIEWED");
        result.setUpdatedAt(LocalDateTime.now());
        resultRepository.save(result);

        // Update answer sheet status
        answerSheetRepository.findById(result.getSheetId()).ifPresent(sheet -> {
            sheet.setStatus("TEACHER_REVIEWED");
            answerSheetRepository.save(sheet);
        });

        // Immutable audit trail recording
        auditService.recordLog(
                resultId,
                req.getTeacherUserId(),
                "OVERRIDE_QUESTION_" + req.getQuestionId(),
                priorFinalScore,
                newTotal,
                req.getTeacherNotes() != null ? req.getTeacherNotes() : "Teacher marks adjustment"
        );

        return getSheetEvaluation(result.getSheetId());
    }

    @Transactional
    public EvaluationDto.SheetEvaluationResponse approveResult(String resultId, EvaluationDto.ApproveResultRequest req) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new IllegalArgumentException("Result not found: " + resultId));

        result.setStatus("TEACHER_REVIEWED");
        result.setApprovedByUserId(req.getApprovedByUserId() != null ? req.getApprovedByUserId() : "usr-101");
        result.setApprovedAt(LocalDateTime.now());
        if (req.getFeedback() != null && !req.getFeedback().isBlank()) {
            result.setOverallFeedback(req.getFeedback());
        }
        resultRepository.save(result);

        answerSheetRepository.findById(result.getSheetId()).ifPresent(sheet -> {
            sheet.setStatus("TEACHER_REVIEWED");
            answerSheetRepository.save(sheet);
        });

        auditService.recordLog(
                resultId,
                result.getApprovedByUserId(),
                "APPROVE_RESULT",
                result.getFinalScore(),
                result.getFinalScore(),
                "Teacher verified and approved scorecard"
        );

        return getSheetEvaluation(result.getSheetId());
    }

    private String calculateGrade(Double percentage) {
        if (percentage >= 95.0) return "A1+";
        if (percentage >= 90.0) return "A1";
        if (percentage >= 80.0) return "A2";
        if (percentage >= 70.0) return "B1";
        if (percentage >= 60.0) return "B2";
        if (percentage >= 50.0) return "C";
        return "D";
    }

    private List<String> parseJsonStringList(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            // Fallback: strip brackets and quotes if stored simply
            String cleaned = json.replaceAll("[\\[\\]\"]", "").trim();
            if (cleaned.isEmpty()) {
                return Collections.emptyList();
            }
            List<String> list = new ArrayList<>();
            for (String part : cleaned.split(",")) {
                if (!part.trim().isEmpty()) {
                    list.add(part.trim());
                }
            }
            return list;
        }
    }
}
