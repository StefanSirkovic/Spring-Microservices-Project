package com.team.project.manager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/manager")
public class ManagerController {

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<String> getManagerDashboard() {
        return ResponseEntity.ok("Welcome to the Manager Dashboard");
    }
}
