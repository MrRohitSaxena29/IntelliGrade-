package com.intelligrade.controller;

import com.intelligrade.dto.AuditDto;
import com.intelligrade.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<List<AuditDto.AuditLogDto>> getAllAuditLogs(
            @RequestParam(required = false) String resultId) {
        if (resultId != null && !resultId.isBlank()) {
            return ResponseEntity.ok(auditService.getLogsForResult(resultId));
        }
        return ResponseEntity.ok(auditService.getAllLogs());
    }

    @GetMapping("/result/{resultId}")
    public ResponseEntity<List<AuditDto.AuditLogDto>> getLogsForResult(@PathVariable String resultId) {
        return ResponseEntity.ok(auditService.getLogsForResult(resultId));
    }
}
