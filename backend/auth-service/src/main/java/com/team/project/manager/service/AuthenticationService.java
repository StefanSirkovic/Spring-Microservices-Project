package com.team.project.manager.service;

import com.team.project.manager.auth.AuthenticationRequest;
import com.team.project.manager.auth.AuthenticationResponse;
import com.team.project.manager.auth.RegisterRequest;
import com.team.project.manager.entity.Role;
import com.team.project.manager.entity.User;
import com.team.project.manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public AuthenticationResponse register(RegisterRequest request) {

        if(userRepository.findByEmail(request.getEmail()).isPresent())
            throw new IllegalArgumentException("Email already exists");

        var user= User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        if(request.getRole()==null)
            throw new IllegalArgumentException("Role must be provided");

        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );


        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public Map<String,Object> adminDashboard(){
        List<User> users = userRepository.findAll();
        Map<String,Object> response = new HashMap<>();
        response.put("users",users);
        return response;
    }

    public void delete(User user) {
            this.userRepository.delete(user);
    }
}



