package com.esgis2026.assigame.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Données envoyées par le frontend pour se connecter.
 * "login" peut être soit le login, soit l'adresse email de l'utilisateur.
 */
@Getter
@Setter
public class LoginRequest {
    private String login;
    private String motdepasse;
}
