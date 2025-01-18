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

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final RestTemplate restTemplate;

    public Team createTeam(TeamDto teamDto) {
        Team team = new Team();
        team.setName(teamDto.getName());
        team.setDescription(teamDto.getDescription());

        if(teamRepository.findByName(teamDto.getName()).isPresent())
            throw new IllegalArgumentException("Team already exists");

        for(int userId : teamDto.getUserIds()){
            if(teamDto.getUserIds()==null){
                throw new IllegalArgumentException("User id is null");
            }
            String userServiceUrl = "http://auth-service/auth/" + userId + "/assign-team";
            try {
                restTemplate.put(userServiceUrl, team.getId());
            } catch (Exception e) {
                throw new IllegalArgumentException("Error while saving team");
            }
        }
        team = teamRepository.save(team);
        return team;
    }
}
