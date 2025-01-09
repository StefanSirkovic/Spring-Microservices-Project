package com.team.project.manager.controller;

import com.team.project.manager.auth.AuthenticationRequest;
import com.team.project.manager.auth.AuthenticationResponse;
import com.team.project.manager.auth.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.team.project.manager.auth.*;
import com.team.project.manager.service.*;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

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

    @PostMapping("/logout")
    public ResponseEntity<?>  logout(){
        return ResponseEntity.ok("Logged out successfully");
    }


}
