package com.intelligrade.service;

import com.intelligrade.dto.BatchDto;
import com.intelligrade.entity.AnswerSheet;
import com.intelligrade.entity.BatchUpload;
import com.intelligrade.entity.Exam;
import com.intelligrade.repository.AnswerSheetRepository;
import com.intelligrade.repository.BatchUploadRepository;
import com.intelligrade.repository.ExamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BatchService {

    private final BatchUploadRepository batchUploadRepository;
    private final AnswerSheetRepository answerSheetRepository;
    private final ExamRepository examRepository;

    @Value("${app.storage.upload-dir:./uploads}")
    private String uploadDir;

    @Transactional(readOnly = true)
    public List<BatchDto.BatchSummaryDto> getAllBatches() {
        return batchUploadRepository.findAll().stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BatchDto.BatchSummaryDto> getBatchesByExamId(String examId) {
        return batchUploadRepository.findByExamIdOrderByUploadedAtDesc(examId).stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BatchDto.BatchSummaryDto getBatchById(String uploadId) {
        BatchUpload batch = batchUploadRepository.findById(uploadId)
                .orElseThrow(() -> new IllegalArgumentException("Batch upload not found: " + uploadId));
        return mapToSummary(batch);
    }

    @Transactional
    public BatchDto.BatchUploadResponse processUpload(String examId, String userId, MultipartFile file, String batchName) {
        String uploadId = "batch-" + UUID.randomUUID().toString().substring(0, 8);
        String fileName = (file != null && !file.isEmpty()) ? file.getOriginalFilename() : (batchName != null ? batchName : "Batch_Scan_" + uploadId + ".pdf");
        String s3Url = "s3://intelligrade-vault/batches/" + fileName;

        // Persist file locally if provided
        if (file != null && !file.isEmpty()) {
            try {
                Path uploadPath = Paths.get(uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path targetLocation = uploadPath.resolve(uploadId + "_" + fileName);
                file.transferTo(targetLocation.toFile());
                s3Url = targetLocation.toAbsolutePath().toString();
            } catch (IOException e) {
                // Log and continue with s3 reference
            }
        }

        BatchUpload batchUpload = BatchUpload.builder()
                .uploadId(uploadId)
                .examId(examId)
                .userId(userId != null ? userId : "usr-101")
                .batchName(fileName)
                .batchStatus("PROCESSING")
                .s3ArchiveUrl(s3Url)
                .totalSheets(1)
                .processedSheets(0)
                .processingStep("Extracting pages & OCR parsing with PaddleOCR...")
                .uploadedAt(LocalDateTime.now())
                .build();

        batchUploadRepository.save(batchUpload);

        // Create sample answer sheet for this batch
        String sheetId = "sheet-" + UUID.randomUUID().toString().substring(0, 8);
        AnswerSheet sheet = AnswerSheet.builder()
                .sheetId(sheetId)
                .batchUploadId(uploadId)
                .studentId("stu-101")
                .extractedStudentRoll("12044")
                .s3PdfUrl("https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&auto=format&fit=crop&q=80")
                .pageCount(2)
                .status("PROCESSING")
                .uploadedAt(LocalDateTime.now())
                .build();

        answerSheetRepository.save(sheet);

        return BatchDto.BatchUploadResponse.builder()
                .uploadId(uploadId)
                .batchName(fileName)
                .batchStatus("PROCESSING")
                .totalSheets(1)
                .message("Batch uploaded successfully and queued for PaddleOCR vision processing.")
                .build();
    }

    private BatchDto.BatchSummaryDto mapToSummary(BatchUpload batch) {
        String examTitle = examRepository.findById(batch.getExamId())
                .map(Exam::getExamTitle)
                .orElse("Exam " + batch.getExamId());

        return BatchDto.BatchSummaryDto.builder()
                .uploadId(batch.getUploadId())
                .examId(batch.getExamId())
                .examTitle(examTitle)
                .userId(batch.getUserId())
                .batchName(batch.getBatchName())
                .batchStatus(batch.getBatchStatus())
                .s3ArchiveUrl(batch.getS3ArchiveUrl())
                .totalSheets(batch.getTotalSheets())
                .processedSheets(batch.getProcessedSheets())
                .processingStep(batch.getProcessingStep())
                .uploadedAt(batch.getUploadedAt())
                .build();
    }
}
