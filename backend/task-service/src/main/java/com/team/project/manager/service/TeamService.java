package com.team.project.manager.service;

import com.team.project.manager.dto.TeamDto;
import com.team.project.manager.entity.Team;
import com.team.project.manager.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final RestTemplate restTemplate;

    public Team createTeam(TeamDto teamDto) {

        if(teamRepository.findByName(teamDto.getName()).isPresent())
            throw new IllegalArgumentException("Team already exists");
        Team team = new Team();
        team.setName(teamDto.getName());
        team.setDescription(teamDto.getDescription());
        team = teamRepository.save(team);

        for(Integer userId : teamDto.getUserIds()){
            if(teamDto.getUserIds()==null || teamDto.getUserIds().isEmpty()){
                throw new IllegalArgumentException("User id is null");
            }
            if(userId ==null)
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
        if(teamRepository.findByName(team.getName()).isPresent()) {
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
}
