package com.team.project.manager.repository;

import com.team.project.manager.entity.Project;
import com.team.project.manager.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    Project findByTeam(Team team);
    List<Project> findAllByTeam(Team team);
}
