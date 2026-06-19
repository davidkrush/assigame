package com.esgis2026.assigame.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Réponse renvoyée après connexion/inscription réussie.
 * Ne contient JAMAIS le mot de passe.
 */
@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private Long id_utilisateur;
    private String nom;
    private String prenom;
    private String email;
    private String login;
    private String telephone;
    private String statut;
    private String typeUtilisateur;
    private String token;
}
