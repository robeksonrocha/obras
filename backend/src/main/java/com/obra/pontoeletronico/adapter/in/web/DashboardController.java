package com.obra.pontoeletronico.adapter.in.web;

import com.obra.pontoeletronico.dto.DashboardDTO;
import com.obra.pontoeletronico.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    public DashboardDTO getDashboardData() {
        return dashboardService.getDashboardData();
    }
} 