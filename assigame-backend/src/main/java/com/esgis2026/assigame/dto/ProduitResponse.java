package com.esgis2026.assigame.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Représentation "plate" d'un produit, envoyée au frontend.
 * Évite les boucles JSON infinies liées au LAZY loading de Hibernate
 * (categorieProduit / utilisateur) et n'expose que les infos utiles.
 */
@Getter
@Setter
@AllArgsConstructor
public class ProduitResponse {
    private Long id_produit;
    private String nom_produit;
    private String description;
    private double prix;
    private String image;
    private LocalDateTime date_ajout;
    private String statut;

    private Long idcategorie_produit;
    private String nom_categorieproduit;

    private Long id_utilisateur;
    private String nom_vendeur;
    private String prenom_vendeur;
    private String telephone_vendeur;
}
