package com.team.project.manager.controller;

import com.team.project.manager.dto.TeamDto;
import com.team.project.manager.entity.Team;
import com.team.project.manager.repository.TeamRepository;
import com.team.project.manager.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.team.project.manager.config.WebConfig;

@RestController
@RequiredArgsConstructor
@RequestMapping("/teams")
public class TeamController {

    private final TeamRepository teamRepository;
    private final TeamService teamService;
    private final RestTemplate restTemplate;


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/create")
    public ResponseEntity<Team> createTeam(@RequestBody TeamDto teamDto) {
        return ResponseEntity.ok(teamService.createTeam(teamDto));
    }



}
