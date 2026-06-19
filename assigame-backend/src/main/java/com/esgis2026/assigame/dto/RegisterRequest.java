package com.esgis2026.assigame.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Données envoyées par le frontend pour créer un compte vendeur.
 */
@Getter
@Setter
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String email;
    private String motdepasse;
    private String telephone;
}
