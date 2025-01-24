package com.team.project.manager.service;

import com.team.project.manager.dto.UserDto;
import com.team.project.manager.entity.Project;
import com.team.project.manager.entity.Task;
import com.team.project.manager.entity.Team;
import com.team.project.manager.repository.ProjectRepository;
import com.team.project.manager.repository.TaskRepository;
import com.team.project.manager.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final RestTemplate restTemplate;
    private final TaskRepository taskRepository;

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

        Task task = taskRepository.findByProject(project);
        if(task != null)
            taskRepository.delete(task);

        projectRepository.delete(project);


        return "Project deleted";
    }

    public List<UserDto> getTeamMembers(Integer projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Integer teamId = project.getTeam().getId();

        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String userServiceUrl = "http://localhost:8080/auth/" + teamId + "/get-member";
        try {
            ResponseEntity<UserDto[]> response = restTemplate.exchange(
                    userServiceUrl,
                    HttpMethod.GET,
                    entity,
                    UserDto[].class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                UserDto[] users = response.getBody();
                return (users != null && users.length > 0) ? Arrays.asList(users) : Collections.emptyList();
            } else {
                throw new IllegalArgumentException("Failed to fetch team members from user service");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Error while fetching team member for teamId: " + teamId, e);
        }


    }
}
