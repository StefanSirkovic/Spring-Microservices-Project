package com.team.project.manager.controller;

import com.team.project.manager.entity.Task;
import com.team.project.manager.repository.TaskRepository;
import com.team.project.manager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final TaskService taskService;

    @PostMapping("/create/{id}")
    public ResponseEntity<Task> create(@PathVariable("id") Integer projectId, @RequestBody Task task) {
        return ResponseEntity.ok(taskService.createTask(projectId,task));
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAll() {
        return ResponseEntity.ok(taskService.getTasks());
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<String> remove(@PathVariable("id") Integer taskId){
        return ResponseEntity.ok(taskService.removeTask(taskId));
    }
}
