package com.intelligrade.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

public class ExamDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateExamRequest {
        private String examTitle;
        private String subject;
        private Double totalMarks;
        private LocalDate date;
        private String academicYear;
        private String instituteId;
        private List<QuestionDto> questions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExamDetailDto {
        private String examId;
        private String instituteId;
        private String examTitle;
        private String subject;
        private Double totalMarks;
        private LocalDate date;
        private String academicYear;
        private List<QuestionDto> questions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionDto {
        private String questionId;
        private String examId;
        private Integer questionNumber;
        private String questionText;
        private Double maxMarks;
        private List<RubricDto> rubrics;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RubricDto {
        private String rubricId;
        private String questionId;
        private String criteriaText;
        private Double weightagePoints;
        private String aiGradingPrompt;
    }
}
