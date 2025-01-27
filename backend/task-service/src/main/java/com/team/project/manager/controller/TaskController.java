package com.team.project.manager.controller;

import com.team.project.manager.dto.UserDto;
import com.team.project.manager.entity.Task;
import com.team.project.manager.repository.TaskRepository;
import com.team.project.manager.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    @GetMapping("/{id}")
    public ResponseEntity<List<Task>> getByProject(@PathVariable("id") Integer projectId){
        return ResponseEntity.ok(taskService.getTaskByProject(projectId));
    }

    @GetMapping("/get-tasks")
    public ResponseEntity<List<Task>> getTasksByTeamAndDateRange(
            @RequestParam("teamId") Long teamId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<Task> tasks = taskService.getTasksByTeamAndDateRange(teamId, startDate, endDate);

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/get-member")
    public ResponseEntity <UserDto> getMember(@RequestParam("id") Integer taskId) {
        return ResponseEntity.ok(taskService.getMembersByTask(taskId));
    }

    @GetMapping("/get-task/{id}")
    public ResponseEntity<List<Task>> getByUser(@PathVariable("id") Integer userId) {
        return ResponseEntity.ok(taskService.getTaskByUser(userId));
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<String> updateStatus(@PathVariable("id") Integer taskId, @RequestParam("status") String status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId,status));
    }




}
