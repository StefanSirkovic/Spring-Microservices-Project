package com.team.project.manager.controller;

import com.team.project.manager.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.team.project.manager.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository repository;

    @GetMapping("/dashboard")
    public List<User> getAdminDashboard() {
        List<User> users = repository.findAll();
        return users;
    }
}
