package com.bloodfinder.service;

import com.bloodfinder.dto.request.LoginRequest;
import com.bloodfinder.dto.request.RegisterRequest;
import com.bloodfinder.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);
}
