package com.team.project.manager.controller;

import com.team.project.manager.auth.AuthenticationRequest;
import com.team.project.manager.auth.AuthenticationResponse;
import com.team.project.manager.auth.RegisterRequest;
import com.team.project.manager.entity.User;
import com.team.project.manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.team.project.manager.auth.*;
import com.team.project.manager.service.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse>  register(@RequestBody RegisterRequest request){
        try {
            return ResponseEntity.ok(service.register(request));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new AuthenticationResponse(e.getMessage()));
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse>  authenticate(@RequestBody AuthenticationRequest request){
        return ResponseEntity.ok(service.authenticate(request));
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

    @GetMapping("/{teamId}/get-member")
    public ResponseEntity<List<User>> getMembers(@PathVariable("teamId") Integer teamId){
        return ResponseEntity.ok(service.getMembers(teamId));
    }

    @PutMapping("/{id}/remove-member")
    public ResponseEntity<User> removeMember(@PathVariable("id") Integer id){
        return ResponseEntity.ok(service.removeMembers(id));
    }


}
