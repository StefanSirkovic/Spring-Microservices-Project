package com.team.project.manager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/manager")
public class ManagerController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> getManagerDashboard() {
        return ResponseEntity.ok("Welcome to the Manager Dashboard");
    }
}
