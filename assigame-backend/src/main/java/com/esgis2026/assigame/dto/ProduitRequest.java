package com.esgis2026.assigame.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Données envoyées par le frontend pour créer ou modifier un produit.
 */
@Getter
@Setter
public class ProduitRequest {
    private String nom_produit;
    private String description;
    private double prix;
    private String image;
    private String statut;
    private Long idcategorie_produit;
    private Long id_utilisateur;
}
