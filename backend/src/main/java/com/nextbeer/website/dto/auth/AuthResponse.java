package com.nextbeer.website.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;

    private String refreshToken;

    private String tokenType = "Bearer";

    private String username;

    private List<String> roles;

    public AuthResponse(String accessToken, String refreshToken, String username, List<String> roles) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.username = username;
        this.roles = roles;
    }
}
