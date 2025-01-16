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

}
