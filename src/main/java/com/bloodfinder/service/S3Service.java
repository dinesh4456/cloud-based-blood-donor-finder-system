package com.bloodfinder.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name:blood-donor-finder-images}")
    private String bucketName;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile file) throws IOException {

        System.out.println("========== S3 Upload ==========");
        System.out.println("Original Name : " + file.getOriginalFilename());
        System.out.println("Content Type  : " + file.getContentType());
        System.out.println("Size          : " + file.getSize());

        byte[] bytes = file.getBytes();
        System.out.println("Byte Length   : " + bytes.length);

        String originalName = file.getOriginalFilename();

        String safeName = (originalName != null && !originalName.trim().isEmpty())
                ? originalName.replaceAll("[^a-zA-Z0-9._-]", "_")
                : "photo.jpg";

        String fileName = UUID.randomUUID() + "_" + safeName;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(
                putObjectRequest,
                RequestBody.fromBytes(bytes));

        System.out.println("Upload completed.");

        return "https://" + bucketName + ".s3.us-east-1.amazonaws.com/" + fileName;
    }
}
