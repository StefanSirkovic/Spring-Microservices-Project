package com.team.project.manager.service;

import com.team.project.manager.auth.AuthenticationRequest;
import com.team.project.manager.auth.AuthenticationResponse;
import com.team.project.manager.auth.RegisterRequest;
import com.team.project.manager.entity.Role;
import com.team.project.manager.entity.User;
import com.team.project.manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

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


    public AuthenticationResponse update(User user, RegisterRequest request) {

        if(userRepository.findByEmail(request.getEmail()).isPresent())
            throw new IllegalArgumentException("Email already exists");

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        if(request.getRole()==null)
            throw new IllegalArgumentException("Role must be provided");

        repository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public User assignTeam(Integer id, Integer teamId){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setTeamId(teamId);
        userRepository.save(user);
        return user;
    }

    public ResponseEntity<String> deleteTeam(Integer teamId) {
        if(!userRepository.findByTeamId(teamId).isEmpty()){
            List<User> userList = userRepository.findAll();
            for(User user : userList){
                if(user.getTeamId()!=null && user.getTeamId().equals(teamId)) {
                    user.setTeamId(null);
                    userRepository.save(user);

                }
            }
            return ResponseEntity.ok("Team deleted successfully");
        }
        return ResponseEntity.ok("No users in the team");
    }

    public User addMembers(Integer id, Integer teamId) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setTeamId(teamId);
        userRepository.save(user);
        return user;
    }

    public List<User> getMembers(Integer teamId) {
        List<User> users = userRepository.findAllByTeamId(teamId);
        if(users.isEmpty())
            throw new RuntimeException("No users found for teamId: " + teamId);

        return users;
    }
}



