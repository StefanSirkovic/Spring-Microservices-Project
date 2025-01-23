package com.team.project.manager.service;

import com.team.project.manager.entity.Project;
import com.team.project.manager.entity.Team;
import com.team.project.manager.repository.ProjectRepository;
import com.team.project.manager.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;

    public Project createProject(Project project) {

        Team team = teamRepository.findById(project.getTeam().getId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        project.setTeam(team);
        project = projectRepository.save(project);

        return project;
    }

    public List<Project> getProjects() {
        return projectRepository.findAll();
    }

    public String deleteProject(Integer id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        projectRepository.delete(project);

        return "Project deleted";

    }
}
