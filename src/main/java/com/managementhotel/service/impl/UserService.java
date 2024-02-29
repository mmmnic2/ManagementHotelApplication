package com.managementhotel.service.impl;

import com.managementhotel.entity.Role;
import com.managementhotel.entity.User;
import com.managementhotel.exception.UserAlreadyExistException;
import com.managementhotel.repository.RoleRepository;
import com.managementhotel.repository.UserRepository;
import com.managementhotel.service.IUserService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Override
    public User registerUser(User user) {
        // method đăng ký tài khoản mới
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserAlreadyExistException(user.getEmail() + " already exists");
        }
        // mã hóa password rồi set vào user
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        //find role with name "ROLE_USER" rồi add vào list role của user
        Role userRole = roleRepository.findByName("ROLE_USER").get();
        user.setRoles(Collections.singletonList(userRole));
        // xong xuôi thì lưu lại vào db
        return userRepository.save(user);
    }

    //method tìm tất cả các user trong db
    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Transactional //anotation dùng để rollback lại khi có lỗi
    @Override
    public void deleteUser(String email) {
        User theUser = getUser(email);
        if (theUser != null) {
            userRepository.deleteByEmail(email);
        }
    }

    @Override
    public User getUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User Not Found!!"));
    }
}
