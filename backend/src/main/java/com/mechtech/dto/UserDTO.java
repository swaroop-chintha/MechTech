package com.mechtech.dto;

import com.mechtech.model.User.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private boolean isVerified;
    private LocalDateTime createdAt;
}
