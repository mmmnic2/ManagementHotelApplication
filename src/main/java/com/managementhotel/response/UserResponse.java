package com.managementhotel.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Collection;
import java.util.HashSet;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Collection<RoleResponse> roles = new HashSet<>();

    public UserResponse(Long id, String email, String firstName, String lastName) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
