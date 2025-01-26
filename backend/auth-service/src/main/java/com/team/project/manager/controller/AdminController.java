package com.team.project.manager.controller;

import com.team.project.manager.auth.AuthenticationResponse;
import com.team.project.manager.auth.RegisterRequest;
import com.team.project.manager.entity.User;
import com.team.project.manager.service.AdminService;
import com.team.project.manager.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;
import com.team.project.manager.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final AdminService service;


    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminDashboard() {
        return ResponseEntity.ok(service.adminDashboard());
    }

    @DeleteMapping("/delete/{user}")
    public ResponseEntity<String> delete(@PathVariable("user") User user){
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            this.service.delete(user);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{user}")
    public ResponseEntity<AuthenticationResponse> update(@PathVariable("user") User user,
                                                         @RequestBody RegisterRequest request){
        try{
            return ResponseEntity.ok(service.update(user, request));
        }catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(new AuthenticationResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/assign-team")
    public ResponseEntity<User> assignTeam(@PathVariable("id") Integer id, @RequestBody Integer teamId){
        return ResponseEntity.ok(service.assignTeam(id, teamId));
    }

    @DeleteMapping("/{id}/delete-team")
    public ResponseEntity<String> deleteTeam(@PathVariable("id") Integer id){
        return this.service.deleteTeam(id);
    }

    @PutMapping("/{id}/team-member")
    public ResponseEntity<User> addMembers(@PathVariable("id") Integer id, @RequestBody Integer teamId){
        return ResponseEntity.ok(service.addMembers(id, teamId));
    }

    @PutMapping("/{id}/remove-member")
    public ResponseEntity<User> removeMember(@PathVariable("id") Integer id){
        return ResponseEntity.ok(service.removeMembers(id));
    }


}
