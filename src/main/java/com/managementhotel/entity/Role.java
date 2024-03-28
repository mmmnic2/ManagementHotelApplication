package com.managementhotel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToMany(mappedBy = "roles")
    private Collection<User> users = new HashSet<>();

    public Role(String name) {
        this.name = name;
    }

    // tạo hàm thêm mới một role cho user => vì cả 2 đều lưu mảng của nhau
    // => cần add user vào listUser của role và add role vào listRole của user
    public void assignRoleToUser(User user) {
        user.getRoles().add(this);
        if (!users.contains(user)) {
            this.users.add(user);
        }

    }
    // hàm xóa user khỏi listUser của role

    public void removeUserFromRole(User user) {
        // vì role và user có ràng buộc khóa ngoại cụ thể trong role chứa 1 list user và ngược lại
        // nên khi xóa role khỏi user thì user cũng được xóa khỏi role
        //user.setRoles();
        user.getRoles().remove(this);
        this.users.remove(user);
    }

    // hàm xóa tất cả user của role
    public void removeAllUserFromRole() {
        if (this.getUsers() != null) {
            List<User> roleUsers = this.getUsers().stream().toList();
            roleUsers.forEach(this::removeUserFromRole);
            // theo mình nghĩ là thiếu hàm xóa tất cả các user trong role
            // setUsers();
        }
    }

    public String getName() {
        return name != null ? name : "";
    }
}
