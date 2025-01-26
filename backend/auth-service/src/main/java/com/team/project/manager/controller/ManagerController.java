package com.team.project.manager.controller;

import com.team.project.manager.entity.User;
import com.team.project.manager.service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/manager")
public class ManagerController {

    AuthenticationService service;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<String> getManagerDashboard() {
        return ResponseEntity.ok("Welcome to the Manager Dashboard");
    }


}
