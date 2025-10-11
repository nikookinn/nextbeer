package com.nextbeer.website.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;
@Slf4j
@RestController
@RequestMapping("/api/v1")
public class FileDownloadController {
    @Value("${app.image.upload.dir}")
    private String uploadDir;



    @GetMapping("/downloadAll")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public void downloadAllFiles(HttpServletResponse response) throws IOException {
        String zipFileName = "images.zip";

        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=" + zipFileName);

        Path folderPath = Paths.get(uploadDir);

        try (
                ZipOutputStream zos = new ZipOutputStream(response.getOutputStream());
                Stream<Path> paths = Files.walk(folderPath)
        ) {
            log.info("file download start... :"+ folderPath);
            paths
                    .filter(Files::isRegularFile)
                    .forEach(filePath -> {
                        ZipEntry zipEntry = new ZipEntry(folderPath.relativize(filePath).toString());
                        try {
                            zos.putNextEntry(zipEntry);
                            Files.copy(filePath, zos);
                            zos.closeEntry();
                        } catch (IOException e) {
                        log.error("something went wrong while downloading files from volume");
                        }
                    });
        }
        log.info("files successfully downloaded from corresponding docker volume :"+ folderPath);
    }

    @PostMapping("/uploadAll")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<String> uploadZip(@RequestParam("file") MultipartFile zipFile) {
        if (zipFile.isEmpty()) {
            return ResponseEntity.badRequest().body("Zip file is empty.");
        }

        Path tempZipPath;
        try {
            tempZipPath = Files.createTempFile("uploaded-", ".zip");
            Files.write(tempZipPath, zipFile.getBytes());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to store temporary zip.");
        }

        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(tempZipPath.toFile()))) {
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                Path newPath = resolveZipEntry(uploadDir, entry);
                if (entry.isDirectory()) {
                    Files.createDirectories(newPath);
                } else {
                    Files.createDirectories(newPath.getParent());
                    Files.copy(zis, newPath, StandardCopyOption.REPLACE_EXISTING);
                }
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to unzip file.");
        }

        return ResponseEntity.ok("Zip extracted and contents uploaded successfully.");
    }

    private Path resolveZipEntry(String targetDir, ZipEntry entry) throws IOException {
        Path targetPath = Paths.get(targetDir).resolve(entry.getName()).normalize();
        if (!targetPath.startsWith(targetDir)) {
            throw new IOException("Invalid zip entry: " + entry.getName());
        }
        return targetPath;
    }



}
