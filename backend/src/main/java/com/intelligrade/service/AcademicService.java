package com.intelligrade.service;

import com.intelligrade.dto.ExamDto;
import com.intelligrade.entity.Exam;
import com.intelligrade.entity.Question;
import com.intelligrade.entity.Rubric;
import com.intelligrade.repository.ExamRepository;
import com.intelligrade.repository.QuestionRepository;
import com.intelligrade.repository.RubricRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AcademicService {

    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final RubricRepository rubricRepository;

    @Transactional(readOnly = true)
    public List<ExamDto.ExamDetailDto> getAllExams() {
        return examRepository.findAll().stream()
                .map(this::mapToExamDetail)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ExamDto.ExamDetailDto> getExamsByInstitute(String instituteId) {
        return examRepository.findByInstituteIdOrderByCreatedAtDesc(instituteId).stream()
                .map(this::mapToExamDetail)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ExamDto.ExamDetailDto getExamById(String examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found: " + examId));
        return mapToExamDetail(exam);
    }

    @Transactional
    public ExamDto.ExamDetailDto createExam(ExamDto.CreateExamRequest request) {
        String examId = "exam-" + UUID.randomUUID().toString().substring(0, 8);
        String instituteId = request.getInstituteId() != null ? request.getInstituteId() : "inst-1";

        Exam exam = Exam.builder()
                .examId(examId)
                .instituteId(instituteId)
                .examTitle(request.getExamTitle())
                .subject(request.getSubject())
                .totalMarks(request.getTotalMarks() != null ? request.getTotalMarks() : 50.0)
                .date(request.getDate())
                .academicYear(request.getAcademicYear() != null ? request.getAcademicYear() : "2026-2027")
                .build();

        examRepository.save(exam);

        List<ExamDto.QuestionDto> savedQuestions = new ArrayList<>();

        if (request.getQuestions() != null && !request.getQuestions().isEmpty()) {
            for (ExamDto.QuestionDto qDto : request.getQuestions()) {
                // Validate rubric points sum up to question max marks if rubrics exist
                if (qDto.getRubrics() != null && !qDto.getRubrics().isEmpty()) {
                    double rubricSum = qDto.getRubrics().stream()
                            .mapToDouble(r -> r.getWeightagePoints() != null ? r.getWeightagePoints() : 0.0)
                            .sum();
                    if (Math.abs(rubricSum - qDto.getMaxMarks()) > 0.01) {
                        throw new IllegalArgumentException(
                                "Rubric weightage points (" + rubricSum + ") must equal Question "
                                        + qDto.getQuestionNumber() + " max marks (" + qDto.getMaxMarks() + ")"
                        );
                    }
                }

                String qId = qDto.getQuestionId() != null ? qDto.getQuestionId() : "q-" + UUID.randomUUID().toString().substring(0, 8);
                Question question = Question.builder()
                        .questionId(qId)
                        .examId(examId)
                        .questionNumber(qDto.getQuestionNumber())
                        .questionText(qDto.getQuestionText())
                        .maxMarks(qDto.getMaxMarks())
                        .build();
                questionRepository.save(question);

                List<ExamDto.RubricDto> savedRubrics = new ArrayList<>();
                if (qDto.getRubrics() != null) {
                    for (ExamDto.RubricDto rDto : qDto.getRubrics()) {
                        String rId = rDto.getRubricId() != null ? rDto.getRubricId() : "rub-" + UUID.randomUUID().toString().substring(0, 8);
                        Rubric rubric = Rubric.builder()
                                .rubricId(rId)
                                .questionId(qId)
                                .criteriaText(rDto.getCriteriaText())
                                .weightagePoints(rDto.getWeightagePoints())
                                .aiGradingPrompt(rDto.getAiGradingPrompt())
                                .build();
                        rubricRepository.save(rubric);
                        rDto.setRubricId(rId);
                        rDto.setQuestionId(qId);
                        savedRubrics.add(rDto);
                    }
                }

                qDto.setQuestionId(qId);
                qDto.setExamId(examId);
                qDto.setRubrics(savedRubrics);
                savedQuestions.add(qDto);
            }
        }

        return ExamDto.ExamDetailDto.builder()
                .examId(examId)
                .instituteId(instituteId)
                .examTitle(exam.getExamTitle())
                .subject(exam.getSubject())
                .totalMarks(exam.getTotalMarks())
                .date(exam.getDate())
                .academicYear(exam.getAcademicYear())
                .questions(savedQuestions)
                .build();
    }

    private ExamDto.ExamDetailDto mapToExamDetail(Exam exam) {
        List<Question> questions = questionRepository.findByExamIdOrderByQuestionNumberAsc(exam.getExamId());
        List<ExamDto.QuestionDto> questionDtos = questions.stream().map(q -> {
            List<Rubric> rubrics = rubricRepository.findByQuestionId(q.getQuestionId());
            List<ExamDto.RubricDto> rubricDtos = rubrics.stream().map(r -> ExamDto.RubricDto.builder()
                    .rubricId(r.getRubricId())
                    .questionId(r.getQuestionId())
                    .criteriaText(r.getCriteriaText())
                    .weightagePoints(r.getWeightagePoints())
                    .aiGradingPrompt(r.getAiGradingPrompt())
                    .build()
            ).collect(Collectors.toList());

            return ExamDto.QuestionDto.builder()
                    .questionId(q.getQuestionId())
                    .examId(q.getExamId())
                    .questionNumber(q.getQuestionNumber())
                    .questionText(q.getQuestionText())
                    .maxMarks(q.getMaxMarks())
                    .rubrics(rubricDtos)
                    .build();
        }).collect(Collectors.toList());

        return ExamDto.ExamDetailDto.builder()
                .examId(exam.getExamId())
                .instituteId(exam.getInstituteId())
                .examTitle(exam.getExamTitle())
                .subject(exam.getSubject())
                .totalMarks(exam.getTotalMarks())
                .date(exam.getDate())
                .academicYear(exam.getAcademicYear())
                .questions(questionDtos)
                .build();
    }
}
