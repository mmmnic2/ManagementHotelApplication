package com.managementhotel.service;

import com.managementhotel.entity.User;

import java.util.List;

public interface IUserService {
    User registerUser(User user);
    List<User> getUsers();
    void deleteUser(String email);
    User getUser(String email);
    //mới thêm vào
    User getUserByUserId(Long userId);
}
