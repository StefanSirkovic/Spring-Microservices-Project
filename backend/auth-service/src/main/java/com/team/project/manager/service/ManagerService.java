package com.team.project.manager.service;

import com.team.project.manager.entity.User;
import com.team.project.manager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerService {

    UserRepository userRepository;

    public List<User> getMembers(Integer teamId) {
        List<User> users = userRepository.findAllByTeamId(teamId);

        return users;
    }


    public User getMember(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user;
    }
}
