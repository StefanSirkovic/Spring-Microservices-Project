package com.team.project.manager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/member")
public class MemberController {

    @GetMapping("/dashboard")
    public ResponseEntity<String> getMemberDashboard() {
        return ResponseEntity.ok("Welcome to the Member Dashboard");
    }
}
