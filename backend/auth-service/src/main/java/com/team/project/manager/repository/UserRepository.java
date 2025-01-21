package com.team.project.manager.repository;

import com.team.project.manager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {


    Optional<User> findByEmail(String email);
    List<User> findByTeamId(Integer teamId);
    List<User> findAllByTeamId(Integer teamId);


}
