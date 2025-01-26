package com.team.project.manager.service;

import com.team.project.manager.auth.AuthenticationResponse;
import com.team.project.manager.auth.RegisterRequest;
import com.team.project.manager.entity.User;
import com.team.project.manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    JwtService jwtService;


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

        userRepository.save(user);

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

    public User removeMembers(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setTeamId(null);
        userRepository.save(user);
        return user;

    }


}
