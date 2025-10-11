package com.nextbeer.website.service.serviceImpl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Service
public class FileStorageService {


    @Value("${app.image.upload.dir:/app/images}")
    private String uploadDir;

    // Store the file after processing (cropping and resizing)
    public String storeFile(MultipartFile file, String subDirectory) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty or null.");
        }

        String targetDir = uploadDir + "/" + subDirectory;
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(targetDir, fileName);

        try {
            Files.createDirectories(filePath.getParent());

            try (InputStream inputStream = file.getInputStream()) {
                BufferedImage originalImage = ImageIO.read(inputStream);

                if (subDirectory.equals("campaign_images")) {
                    originalImage = resizeToAspectRatio(originalImage, 1920, 1080);
                } else if (!subDirectory.equals("app_images")) {
                    BufferedImage croppedImage = cropToSquare(originalImage);
                    originalImage = resizeImage(croppedImage, 800);
                } else {
                    originalImage = resizeImage(originalImage, 800);
                }

                saveCompressedImage(originalImage, filePath);
            }

            return "/images/" + subDirectory + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Could not save file: " + file.getOriginalFilename(), e);
        }
    }

    public String saveIcoFile(MultipartFile file, String subDirectory) {
        // Create a unique file name for the .ico file
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, subDirectory, fileName);

        try {
            // Ensure the directory exists
            Files.createDirectories(filePath.getParent());

            // Save the .ico file directly
            Files.copy(file.getInputStream(), filePath);
            log.info("ICO file successfully stored at: " + filePath);

            // Return the file's URL
            return "/images/" + subDirectory + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not save .ico file: " + file.getOriginalFilename(), e);
        }
    }

    // Crop the image to a square (centered)
    private BufferedImage cropToSquare(BufferedImage originalImage) {
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();

        // Get the smaller of the two dimensions
        int size = Math.min(width, height);

        // Calculate the coordinates to crop the image from the center
        int x = (width - size) / 2;
        int y = (height - size) / 2;

        // Create and return the cropped image
        return originalImage.getSubimage(x, y, size, size);
    }

    // Resize the image while maintaining the aspect ratio
    private BufferedImage resizeImage(BufferedImage originalImage, int newWidth) {
        int width = originalImage.getWidth();
        int height = originalImage.getHeight();

        int newHeight = (height * newWidth) / width;
        Image scaledImage = originalImage.getScaledInstance(newWidth, newHeight, Image.SCALE_SMOOTH);

        BufferedImage bufferedScaledImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = bufferedScaledImage.createGraphics();
        g2d.drawImage(scaledImage, 0, 0, null);
        g2d.dispose();

        return bufferedScaledImage;
    }

    // Compress and save the image as a JPEG
    private void saveCompressedImage(BufferedImage image, Path path) throws IOException {
        try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {
            ImageIO.write(image, "JPEG", byteArrayOutputStream);
            byte[] imageBytes = byteArrayOutputStream.toByteArray();
            Files.write(path, imageBytes);
            log.info("Image successfully stored on path " + path);
        }
    }

    // Delete an existing image from the file system
    public void deleteOldImage(String existingImageUrl, String subDirectory) {
        if (existingImageUrl != null && !existingImageUrl.isEmpty()) {
            String fileName = Paths.get(existingImageUrl).getFileName().toString();

            String filePath = uploadDir + "/" + subDirectory + "/" + fileName;
            File file = new File(filePath);

            if (file.exists()) {
                boolean deleted = file.delete();
                if (!deleted) {
                    log.info("Failed to delete old image: " + filePath);
                } else {
                    log.info("Image Successfully deleted on path: " + filePath);
                }
            } else {
                log.info("File does not exist: " + filePath);
            }
        }
    }


    private BufferedImage resizeToAspectRatio(BufferedImage originalImage, int targetWidth, int targetHeight) {
        Image scaledImage = originalImage.getScaledInstance(targetWidth, targetHeight, Image.SCALE_SMOOTH);
        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);

        Graphics2D g2d = resizedImage.createGraphics();
        g2d.setColor(Color.WHITE);
        g2d.fillRect(0, 0, targetWidth, targetHeight);
        g2d.drawImage(scaledImage, 0, 0, null);
        g2d.dispose();

        return resizedImage;
    }
}

