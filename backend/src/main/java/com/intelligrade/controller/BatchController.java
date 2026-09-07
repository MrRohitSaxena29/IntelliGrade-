package com.intelligrade.controller;

import com.intelligrade.dto.BatchDto;
import com.intelligrade.service.BatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchService batchService;

    @GetMapping
    public ResponseEntity<List<BatchDto.BatchSummaryDto>> getAllBatches(
            @RequestParam(required = false) String examId) {
        if (examId != null && !examId.isBlank()) {
            return ResponseEntity.ok(batchService.getBatchesByExamId(examId));
        }
        return ResponseEntity.ok(batchService.getAllBatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BatchDto.BatchSummaryDto> getBatchById(@PathVariable String id) {
        return ResponseEntity.ok(batchService.getBatchById(id));
    }

    @PostMapping("/upload")
    public ResponseEntity<BatchDto.BatchUploadResponse> uploadBatch(
            @RequestParam("examId") String examId,
            @RequestParam(value = "batchName", required = false) String batchName,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Authentication authentication) {
        String userId = (authentication != null) ? authentication.getName() : "usr-101";
        BatchDto.BatchUploadResponse response = batchService.processUpload(examId, userId, file, batchName);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
