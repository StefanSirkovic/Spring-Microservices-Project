package com.team.project.manager.controller;

import com.team.project.manager.entity.User;
import com.team.project.manager.service.ManagerService;
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

    ManagerService service;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<String> getManagerDashboard() {
        return ResponseEntity.ok("Welcome to the Manager Dashboard");
    }

    @GetMapping("/{teamId}/get-member")
    public ResponseEntity<List<User>> getMembers(@PathVariable("teamId") Integer teamId){
        return ResponseEntity.ok(service.getMembers(teamId));
    }

    @GetMapping("/{userId}/get-user")
    public ResponseEntity<User> getMember(@PathVariable("userId") Integer userId){
        return ResponseEntity.ok(service.getMember(userId));
    }
}
