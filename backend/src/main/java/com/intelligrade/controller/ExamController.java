package com.intelligrade.controller;

import com.intelligrade.dto.ExamDto;
import com.intelligrade.service.AcademicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final AcademicService academicService;

    @GetMapping
    public ResponseEntity<List<ExamDto.ExamDetailDto>> getAllExams(
            @RequestParam(required = false) String instituteId) {
        if (instituteId != null && !instituteId.isBlank()) {
            return ResponseEntity.ok(academicService.getExamsByInstitute(instituteId));
        }
        return ResponseEntity.ok(academicService.getAllExams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamDto.ExamDetailDto> getExamById(@PathVariable String id) {
        return ResponseEntity.ok(academicService.getExamById(id));
    }

    @PostMapping
    public ResponseEntity<ExamDto.ExamDetailDto> createExam(@RequestBody ExamDto.CreateExamRequest request) {
        ExamDto.ExamDetailDto created = academicService.createExam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
