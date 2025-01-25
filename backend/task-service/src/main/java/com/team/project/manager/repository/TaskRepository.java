package com.team.project.manager.repository;

import com.team.project.manager.entity.Project;
import com.team.project.manager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    Task findByProject(Project project);
    List<Task> findAllByProject(Project project);
}
