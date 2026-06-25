package com.esgis2026.assigame.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Endpoint d'upload d'images.
 *
 * POST /api/upload/image
 *   - Reçoit le fichier image (multipart/form-data, champ "file")
 *   - Génère un nom de fichier unique (UUID) pour éviter les collisions
 *   - Sauvegarde le fichier dans le dossier uploads/ à la racine du projet
 *   - Renvoie l'URL publique : http://localhost:8081/uploads/nom-du-fichier.jpg
 *
 * Les fichiers sauvegardés sont servis statiquement par Spring Boot
 * grâce à la config dans CorsConfig (addResourceHandlers).
 */
@RestController
@RequestMapping("/api/upload")
public class UploadController {

    // Dossier où les images sont sauvegardées.
    // Chemin relatif à l'endroit où Spring Boot est lancé (racine du projet).
    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Aucun fichier reçu."));
        }

        // Vérifier que c'est bien une image
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Le fichier doit être une image (JPG, PNG, WebP...)."));
        }

        try {
            // Créer le dossier uploads/ s'il n'existe pas
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Générer un nom unique pour éviter les collisions de noms de fichiers
            String originalFilename = file.getOriginalFilename() != null
                    ? file.getOriginalFilename()
                    : "image.jpg";
            String extension = originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                    : ".jpg";
            String newFilename = UUID.randomUUID().toString() + extension;

            // Sauvegarder le fichier sur le disque
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Renvoyer l'URL publique complète
            String imageUrl = "http://localhost:8081/uploads/" + newFilename;
            return ResponseEntity.ok(Map.of(
                    "url", imageUrl,
                    "filename", newFilename
            ));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Erreur lors de la sauvegarde du fichier : " + e.getMessage()));
        }
    }
}