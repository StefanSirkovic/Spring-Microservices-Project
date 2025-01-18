package com.team.project.manager.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@RequiredArgsConstructor
public class TeamDto {
    private String name;
    private String description;
    private List<Integer> userIds = new ArrayList<>();

}
