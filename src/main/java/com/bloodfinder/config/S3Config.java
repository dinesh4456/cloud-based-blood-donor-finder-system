package com.bloodfinder.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class S3Config {

    @Value("${aws.access-key:dummy-access-key}")
    private String accessKey;

    @Value("${aws.secret-key:dummy-secret-key}")
    private String secretKey;

    @Value("${aws.region:us-east-1}")
    private String region;

    @Bean
    public S3Client s3Client() {
        String key = (accessKey != null && !accessKey.trim().isEmpty()) ? accessKey.trim() : "dummy-access-key";
        String secret = (secretKey != null && !secretKey.trim().isEmpty()) ? secretKey.trim() : "dummy-secret-key";
        String reg = (region != null && !region.trim().isEmpty()) ? region.trim() : "us-east-1";

        AwsBasicCredentials credentials =
                AwsBasicCredentials.create(key, secret);

        return S3Client.builder()
                .region(Region.of(reg))
                .credentialsProvider(
                        StaticCredentialsProvider.create(credentials))
                .build();
    }
}
