package com.managementhotel.service.impl;

import com.managementhotel.entity.Role;
import com.managementhotel.entity.User;
import com.managementhotel.exception.RoleAlreadyExistException;
import com.managementhotel.exception.UserAlreadyExistException;
import com.managementhotel.repository.RoleRepository;
import com.managementhotel.repository.UserRepository;
import com.managementhotel.service.IRoleService;
import com.managementhotel.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {
    private final RoleRepository roleRepository;
    private final IUserService userService;
    private final UserRepository userRepository;

    @Override
    public List<Role> getRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role createRole(Role theRole) {
        String roleName = "ROLE_" + theRole.getName().toUpperCase();
        Role role = new Role(roleName);
        if (roleRepository.existsByName(roleName)) {
            throw new RoleAlreadyExistException(theRole.getName() + " role already exist");
        }
        return roleRepository.save(role);
    }

    @Override
    public void deleteRole(Long roleId) {
        // vì có ràng buộc khóa ngoại nên xóa user trước
        this.removeAllUsersFromRole(roleId);
        roleRepository.deleteById(roleId);
    }

    @Override
    public Role findRoleByName(String name) {
        return roleRepository.findByName(name).get();
    }

    //trả về user đc xóa
    @Override
    public User removeUserFromRole(Long userId, Long roleId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Role> role = roleRepository.findById(roleId);
        if (role.isPresent() && role.get().getUsers().contains(user.get())) {
            role.get().removeUserFromRole(user.get());
            roleRepository.save(role.get());
            return user.get();
        }
        throw new UsernameNotFoundException("User not found!!!");
    }

    @Override
    public User assignRoleToUser(Long userId, Long roleId) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Role> role = roleRepository.findById(roleId);
        if (user.isPresent() && user.get().getRoles().contains(role.get())) {
            throw new UserAlreadyExistException(user.get().getFirstName() + " is already assigned to the " + role.get().getName());
        }
        if(role.isPresent()){
            role.get().assignRoleToUser(user.get());
            roleRepository.save(role.get());
        }
        return user.get();
    }

    @Override
    public Role removeAllUsersFromRole(Long roleId) {
        Optional<Role> role = roleRepository.findById(roleId);
        role.ifPresent(Role::removeAllUserFromRole);
        return roleRepository.save(role.get());
    }
}
