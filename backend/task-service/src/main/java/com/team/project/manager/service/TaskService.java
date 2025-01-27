package com.team.project.manager.service;

import com.team.project.manager.dto.UserDto;
import com.team.project.manager.entity.Project;
import com.team.project.manager.entity.Task;
import com.team.project.manager.entity.Team;
import com.team.project.manager.repository.ProjectRepository;
import com.team.project.manager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final RestTemplate restTemplate;

    public Task createTask(Integer projectId, Task task) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + task.getProject().getId()));

        Team team = project.getTeam();
        if (team == null) {
            throw new IllegalStateException("Project must have a team assigned.");
        }
        task.setCreationDate(LocalDate.now());
        task.setProject(project);
        task.setTeam(team);

        return taskRepository.save(task);
    }

    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    public String removeTask(Integer taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        taskRepository.delete(task);

        return "Task deleted";
    }

    public List<Task> getTaskByProject(Integer projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + projectId));

        List<Task> findTasks = taskRepository.findAllByProject(project);


        return findTasks;

    }

    public List<Task> getTasksByTeamAndDateRange(Long teamId, LocalDate startDate, LocalDate endDate) {
        return taskRepository.findByTeamIdAndDateRange(teamId, startDate, endDate);
    }

    public UserDto getMembersByTask(Integer taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        Integer userId = task.getUserId();

        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String userServiceUrl = "http://localhost:8080/auth/" + userId + "/get-user";
        try {
            ResponseEntity<UserDto> response = restTemplate.exchange(
                    userServiceUrl,
                    HttpMethod.GET,
                    entity,
                    UserDto.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                UserDto user = response.getBody();
                return (user != null) ? user : null;
            } else {
                throw new IllegalArgumentException("Failed to fetch team members from user service");
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Error while fetching team member for taskId: " + taskId, e);
        }
    }

    public List<Task> getTaskByUser(Integer userId) {
        List<Task> tasks = new ArrayList<>();

        tasks = taskRepository.findAllByUserId(userId);

        return tasks;

    }

    public String updateTaskStatus(Integer taskId, String status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        if(status.equals("completed"))
            task.setCompletedAt(LocalDate.now());

        if(status.equals("in-progress")){
            task.setStartDate(LocalDate.now());
            task.setCompletedAt(null);
        }
        if(status.equals("not-started")){
            task.setStartDate(null);
            task.setCompletedAt(null);
        }

        task.setStatus(status);
        taskRepository.save(task);
        return status;

    }

    public List<String> getAllComments(Integer taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        List<String> comments = new ArrayList<>();
        comments = task.getComments();
        return comments;
    }

    public String addComment(Integer taskId, String comment) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        task.getComments().add(comment);
        taskRepository.save(task);

        return "Comment added successfully";
    }
}
