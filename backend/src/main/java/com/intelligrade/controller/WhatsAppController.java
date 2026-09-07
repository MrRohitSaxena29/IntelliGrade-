package com.intelligrade.controller;

import com.intelligrade.dto.WhatsAppDto;
import com.intelligrade.service.WhatsAppService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/whatsapp")
@RequiredArgsConstructor
public class WhatsAppController {

    private final WhatsAppService whatsAppService;

    @PostMapping("/dispatch")
    public ResponseEntity<WhatsAppDto.WhatsAppDispatchResponse> dispatchScorecards(
            @RequestBody WhatsAppDto.WhatsAppDispatchRequest request) {
        WhatsAppDto.WhatsAppDispatchResponse response = whatsAppService.dispatchScorecards(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<WhatsAppDto.WhatsAppDeliveryLogDto>> getDeliveryLogs(
            @RequestParam(required = false) String resultId) {
        if (resultId != null && !resultId.isBlank()) {
            return ResponseEntity.ok(whatsAppService.getDeliveryLogsForResult(resultId));
        }
        return ResponseEntity.ok(whatsAppService.getAllDeliveryLogs());
    }

    @GetMapping("/logs/result/{resultId}")
    public ResponseEntity<List<WhatsAppDto.WhatsAppDeliveryLogDto>> getDeliveryLogsForResult(
            @PathVariable String resultId) {
        return ResponseEntity.ok(whatsAppService.getDeliveryLogsForResult(resultId));
    }
}
