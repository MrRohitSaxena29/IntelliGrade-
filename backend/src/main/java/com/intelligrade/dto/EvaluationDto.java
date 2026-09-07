package com.intelligrade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class EvaluationDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SheetEvaluationResponse {
        private String sheetId;
        private String examId;
        private String examTitle;
        private StudentDto student;
        private String s3PdfUrl;
        private Integer pageCount;
        private String status;
        private LocalDateTime uploadedAt;
        private List<OCRPageDto> pages;
        private ResultDetailDto result;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudentDto {
        private String studentId;
        private String name;
        private String rollNumber;
        private String gradeSection;
        private String whatsappPhoneNumber;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OCRPageDto {
        private String pageId;
        private Integer pageNumber;
        private String fullTextContent;
        private String imagePreviewUrl;
        private List<BoundingBoxDto> boundingBoxes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BoundingBoxDto {
        private String boxId;
        private String questionId;
        private Double coordX;
        private Double coordY;
        private Double coordWidth;
        private Double coordHeight;
        private String detectedText;
        private Double confidenceScore;
        private Integer lineIndex;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResultDetailDto {
        private String resultId;
        private String sheetId;
        private String examId;
        private String studentId;
        private Double finalScore;
        private Double totalMarks;
        private Double percentage;
        private String gradeLetter;
        private String overallFeedback;
        private String status;
        private String s3ReportUrl;
        private String approvedByUserId;
        private LocalDateTime approvedAt;
        private List<EvaluationItemDto> items;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EvaluationItemDto {
        private String evalItemId;
        private String questionId;
        private String rubricId;
        private Double marksAwarded;
        private Double maxMarks;
        private String aiJustification;
        private List<String> keyPositives;
        private List<String> keyGaps;
        private Double teacherMarks;
        private String teacherNotes;
        private Boolean isOverridden;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OverrideMarksRequest {
        private String questionId;
        private Double teacherMarks;
        private String teacherNotes;
        private String teacherUserId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApproveResultRequest {
        private String approvedByUserId;
        private String feedback;
    }
}
