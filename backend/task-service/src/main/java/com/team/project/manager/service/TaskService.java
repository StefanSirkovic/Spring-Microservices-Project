package com.team.project.manager.service;

import com.team.project.manager.dto.UserDto;
import com.team.project.manager.entity.Project;
import com.team.project.manager.entity.Task;
import com.team.project.manager.entity.Team;
import com.team.project.manager.repository.ProjectRepository;
import com.team.project.manager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

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
}
