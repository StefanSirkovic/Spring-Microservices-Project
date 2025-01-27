package com.team.project.manager.repository;

import com.team.project.manager.entity.Project;
import com.team.project.manager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    Task findByProject(Project project);
    List<Task> findAllByProject(Project project);
    @Query("SELECT t FROM Task t WHERE t.team.id = :teamId AND t.creationDate BETWEEN :startDate AND :endDate")
    List<Task> findByTeamIdAndDateRange(
            @Param("teamId") Long teamId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
    List<Task> findAllByUserId(Integer userId);
}
