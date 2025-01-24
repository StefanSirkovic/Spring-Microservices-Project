package com.team.project.manager.service;

import com.team.project.manager.entity.Project;
import com.team.project.manager.entity.Task;
import com.team.project.manager.entity.Team;
import com.team.project.manager.repository.ProjectRepository;
import com.team.project.manager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
        task.setProject(project);
        task.setTeam(team);

        return taskRepository.save(task);
    }
}
