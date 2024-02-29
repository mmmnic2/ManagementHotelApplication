package com.managementhotel.service;

import com.managementhotel.entity.Role;
import com.managementhotel.entity.User;

import java.util.List;

public interface IRoleService {
    List<Role> getRoles();

    Role createRole(Role theRole);

    void deleteRole(Long roleId);

    Role findRoleByName(String name);

    User removeUserFromRole(Long userId, Long roleId);

    User assignRoleToUser(Long userId, Long roleId);

    Role removeAllUsersFromRole(Long roleId);
}
