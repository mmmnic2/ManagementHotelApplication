package com.managementhotel.dto.response;

import lombok.Data;

import java.util.Collection;
import java.util.HashSet;

@Data
public class RoleResponse {
    private Long id;
    private String name;


    public RoleResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
