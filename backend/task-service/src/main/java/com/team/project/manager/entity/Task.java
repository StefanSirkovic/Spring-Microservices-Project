package com.team.project.manager.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="_task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String description;
    private String priority;
    private String status;
    private Date deadline;
    @ElementCollection
    private List<String> comments;

    private Integer userId;
    @ManyToOne
    @JoinColumn(name="project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name="team_id", nullable = false)
    private Team team;

    private LocalDate creationDate;
    private LocalDate completedAt;
    private LocalDate startDate;


}
