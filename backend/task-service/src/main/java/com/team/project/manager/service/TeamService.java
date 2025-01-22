package com.team.project.manager.service;

import com.team.project.manager.dto.TeamDto;
import com.team.project.manager.dto.UserDto;
import com.team.project.manager.entity.Team;
import com.team.project.manager.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final RestTemplate restTemplate;

    public Team createTeam(TeamDto teamDto) {

        if (teamRepository.findByName(teamDto.getName()).isPresent())
            throw new IllegalArgumentException("Team already exists");
        Team team = new Team();
        team.setName(teamDto.getName());
        team.setDescription(teamDto.getDescription());
        team = teamRepository.save(team);

        for (Integer userId : teamDto.getUserIds()) {
            if (teamDto.getUserIds() == null || teamDto.getUserIds().isEmpty() || userId == null)
                throw new IllegalArgumentException("User id is null");

            String userServiceUrl = "http://localhost:8080/auth/" + userId + "/assign-team";
            try {
                restTemplate.put(userServiceUrl, team.getId());
            } catch (Exception e) {
                throw new IllegalArgumentException("Error while saving team");
            }
        }
        return team;
    }

    public List<Team> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        return teams;
    }

    public ResponseEntity<String> deleteTeamService(Team team) {
        if (teamRepository.findByName(team.getName()).isPresent()) {
            Integer teamId = team.getId();
            String userServiceUrl = "http://localhost:8080/auth/" + teamId + "/delete-team";
            try {
                restTemplate.delete(userServiceUrl);
            } catch (Exception e) {
                throw new IllegalArgumentException("Error while deleting team");
            }

            this.teamRepository.delete(team);
            return ResponseEntity.ok("Team deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    public Team addTeamMembers(TeamDto teamDto) {

        Team team = teamRepository.findByName(teamDto.getName())
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        for (Integer userId : teamDto.getUserIds()) {
            if (teamDto.getUserIds() == null || teamDto.getUserIds().isEmpty() || userId == null)
                throw new IllegalArgumentException("User id is null");

            String userServiceUrl = "http://localhost:8080/auth/" + userId + "/team-member";
            try {
                restTemplate.put(userServiceUrl, team.getId());
            } catch (Exception e) {
                throw new IllegalArgumentException("Error while saving team");
            }
        }
        team = teamRepository.save(team);
        return team;
    }

    public List<UserDto> getTeamMembers(String name) {
        Team team = teamRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));
        Integer teamId = team.getId();

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

    public List<UserDto> removeMember(String name, TeamDto teamDto) {
        Team team = teamRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        List<UserDto> updatedUsers = new ArrayList<>();

        List<UserDto> membersToRemove = new ArrayList<>();
        for (Integer userId : teamDto.getUserIds()) {
            String userServiceUrl = "http://localhost:8080/auth/" + userId + "/remove-member";
            try {
                Map<String, Object> body = new HashMap<>();
                body.put("teamId", null);
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

                ResponseEntity<UserDto> response = restTemplate.exchange(
                        userServiceUrl,
                        HttpMethod.PUT,
                        entity,
                        UserDto.class
                );
                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    updatedUsers.add(response.getBody());
                } else {
                    throw new IllegalArgumentException("Failed to remove teamId for user: " + userId);
                }

            } catch (Exception e) {
                throw new IllegalArgumentException("Error while removing team member: " + userId, e);
            }
        }

        return membersToRemove;
    }

}





