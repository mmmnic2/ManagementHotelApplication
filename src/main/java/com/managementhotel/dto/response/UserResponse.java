package com.managementhotel.dto.response;

import lombok.Data;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Collection<RoleResponse> roles = new HashSet<>();
    private List<BookingsResponse> bookingsResponseList = new ArrayList<>();
    public UserResponse(Long id, String email, String firstName, String lastName) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
