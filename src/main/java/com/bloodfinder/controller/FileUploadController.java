package com.bloodfinder.controller;

import com.bloodfinder.dto.response.ApiResponse;
import com.bloodfinder.service.S3Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    private final S3Service s3Service;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file) throws IOException {
        log.info("Received file upload request: {}", file.getOriginalFilename());
        String fileUrl = s3Service.uploadFile(file);
        return ResponseEntity.ok(ApiResponse.success("File uploaded successfully to S3", Map.of("url", fileUrl)));
    }
}
