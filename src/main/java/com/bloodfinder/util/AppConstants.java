package com.bloodfinder.util;

public final class AppConstants {

    private AppConstants() {
        // Prevent instantiation
    }

    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "20";
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "desc";

    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";

    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_DONOR = "ROLE_DONOR";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";
}
