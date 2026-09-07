package com.intelligrade.controller;

import com.intelligrade.dto.DashboardDto;
import com.intelligrade.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/metrics")
    public ResponseEntity<DashboardDto.DashboardMetricsDto> getMetrics() {
        return ResponseEntity.ok(dashboardService.getMetrics());
    }
}
