package com.intelligrade.controller;

import com.intelligrade.dto.EvaluationDto;
import com.intelligrade.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping("/sheets/{sheetId}/evaluation")
    public ResponseEntity<EvaluationDto.SheetEvaluationResponse> getSheetEvaluation(@PathVariable String sheetId) {
        EvaluationDto.SheetEvaluationResponse response = evaluationService.getSheetEvaluation(sheetId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/results/{resultId}/override")
    public ResponseEntity<EvaluationDto.SheetEvaluationResponse> overrideMarks(
            @PathVariable String resultId,
            @RequestBody EvaluationDto.OverrideMarksRequest request,
            Authentication authentication) {
        if (authentication != null && (request.getTeacherUserId() == null || request.getTeacherUserId().isBlank())) {
            request.setTeacherUserId(authentication.getName());
        }
        EvaluationDto.SheetEvaluationResponse response = evaluationService.overrideMarks(resultId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/results/{resultId}/approve")
    public ResponseEntity<EvaluationDto.SheetEvaluationResponse> approveResult(
            @PathVariable String resultId,
            @RequestBody(required = false) EvaluationDto.ApproveResultRequest request,
            Authentication authentication) {
        if (request == null) {
            request = EvaluationDto.ApproveResultRequest.builder().build();
        }
        if (authentication != null && (request.getApprovedByUserId() == null || request.getApprovedByUserId().isBlank())) {
            request.setApprovedByUserId(authentication.getName());
        }
        EvaluationDto.SheetEvaluationResponse response = evaluationService.approveResult(resultId, request);
        return ResponseEntity.ok(response);
    }
}
