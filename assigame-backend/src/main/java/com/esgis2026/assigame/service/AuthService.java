package com.esgis2026.assigame.service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

import jakarta.annotation.PostConstruct;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.esgis2026.assigame.dto.LoginRequest;
import com.esgis2026.assigame.dto.LoginResponse;
import com.esgis2026.assigame.dto.RegisterRequest;
import com.esgis2026.assigame.entity.TypeUtilisateur;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.repository.TypeUtilisateurRepository;
import com.esgis2026.assigame.repository.UtilisateurRepository;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final TypeUtilisateurRepository typeUtilisateurRepository;

    public AuthService(UtilisateurRepository utilisateurRepository,
                        TypeUtilisateurRepository typeUtilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.typeUtilisateurRepository = typeUtilisateurRepository;
    }

    @PostConstruct
    @Transactional
    private void repairExistingVendorUsers() {
        TypeUtilisateur vendorType = resolveDefaultType();

        List<Utilisateur> usersToUpdate = utilisateurRepository.findAllWithTypeUtilisateur().stream()
            .filter(u -> u.getTypeutilisateur() != null)
            .filter(u -> {
                String typeName = u.getTypeutilisateur().getNom_typeutilisateur();
                if (typeName == null) return false;
                boolean isAdminType = typeName.equalsIgnoreCase("admin");
                boolean looksLikeVendor = (u.getLogin() != null && u.getLogin().toLowerCase().contains("vend"))
                        || (u.getEmail() != null && u.getEmail().toLowerCase().contains("vendeur"));
                return isAdminType && looksLikeVendor;
            })
            .toList();

        if (!usersToUpdate.isEmpty()) {
            usersToUpdate.forEach(u -> u.setTypeutilisateur(vendorType));
            utilisateurRepository.saveAll(usersToUpdate);
        }
    }

    /**
     * Connexion. Le champ "login" envoyé par le frontend peut être
     * soit l'email, soit le login généré à l'inscription.
     */
    public LoginResponse login(LoginRequest request) {
        if (request.getLogin() == null || request.getMotdepasse() == null) {
            throw new IllegalArgumentException("Identifiant et mot de passe requis");
        }

        Utilisateur utilisateur = utilisateurRepository.findByEmailOrLogin(request.getLogin().trim())
                .orElseThrow(() -> new IllegalArgumentException("Identifiants incorrects"));

        if (!utilisateur.getMotdepasse().equals(request.getMotdepasse())) {
            throw new IllegalArgumentException("Identifiants incorrects");
        }

        return toLoginResponse(utilisateur);
    }

    /**
     * Inscription d'un nouveau vendeur.
     * Génère automatiquement un "login" court (<=10 caractères, contrainte
     * de la colonne en base) à partir de l'email, et lui assigne le type
     * "Vendeur" (ou le premier type disponible si "Vendeur" n'existe pas).
     */
    public LoginResponse register(RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("L'email est obligatoire");
        }
        if (request.getMotdepasse() == null || request.getMotdepasse().isBlank()) {
            throw new IllegalArgumentException("Le mot de passe est obligatoire");
        }

        String email = request.getEmail().trim().toLowerCase();

        if (utilisateurRepository.existsByEmailIgnoreCaseCustom(email)) {
            throw new IllegalArgumentException("Un compte existe déjà avec cet email");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(blankToDash(request.getNom()));
        utilisateur.setPrenom(blankToDash(request.getPrenom()));
        utilisateur.setEmail(email);
        utilisateur.setMotdepasse(request.getMotdepasse());
        utilisateur.setTelephone(request.getTelephone());
        utilisateur.setActif("actif");
        utilisateur.setLogin(generateUniqueLogin(email));
        utilisateur.setTypeutilisateur(resolveDefaultType());

        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return toLoginResponse(saved);
    }

    private String blankToDash(String value) {
        return (value == null || value.isBlank()) ? "-" : value.trim();
    }

    /**
     * La colonne "Login" est limitée à 10 caractères en base.
     * On génère donc un identifiant court à partir de la partie locale
     * de l'email (avant le @), en garantissant son unicité.
     */
    private String generateUniqueLogin(String email) {
        String local = email.split("@")[0].replaceAll("[^a-zA-Z0-9]", "");
        if (local.isEmpty()) {
            local = "user";
        }
        String base = local.length() > 7 ? local.substring(0, 7) : local;

        String candidate = base;
        int suffix = 1;
        while (utilisateurRepository.existsByLoginCustom(candidate)) {
            String suffixStr = String.valueOf(suffix);
            int maxBaseLen = 10 - suffixStr.length();
            String trimmedBase = base.length() > maxBaseLen ? base.substring(0, maxBaseLen) : base;
            candidate = trimmedBase + suffixStr;
            suffix++;
        }
        return candidate;
    }

    /**
     * Récupère le type "Vendeur" (recherche insensible à la casse).
     * Si aucun type "Vendeur" n'existe encore, on le crée automatiquement.
     */
    private TypeUtilisateur resolveDefaultType() {
        return typeUtilisateurRepository.findFirstByNomContaining("vendeur")
                .orElseGet(() -> {
                    TypeUtilisateur typeVendeur = new TypeUtilisateur();
                    typeVendeur.setNom_typeutilisateur("Vendeur");
                    typeVendeur.setDescription_typeutilisateur("Type vendeur créé automatiquement");
                    return typeUtilisateurRepository.save(typeVendeur);
                });
    }

    private LoginResponse toLoginResponse(Utilisateur u) {
        String typeNom = u.getTypeutilisateur() != null ? u.getTypeutilisateur().getNom_typeutilisateur() : null;
        String token = Base64.getEncoder().encodeToString(
                (u.getId_utilisateur() + ":" + LocalDateTime.now()).getBytes());

        return new LoginResponse(
                u.getId_utilisateur(),
                u.getNom(),
                u.getPrenom(),
                u.getEmail(),
                u.getLogin(),
                u.getTelephone(),
                u.getActif(),
                typeNom,
                token
        );
    }
}
