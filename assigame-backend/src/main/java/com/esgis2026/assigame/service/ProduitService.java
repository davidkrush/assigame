package com.esgis2026.assigame.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.esgis2026.assigame.dto.ProduitRequest;
import com.esgis2026.assigame.dto.ProduitResponse;
import com.esgis2026.assigame.entity.CategorieProduit;
import com.esgis2026.assigame.entity.Produit;
import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.repository.CategorieProduitRepository;
import com.esgis2026.assigame.repository.ProduitRepository;
import com.esgis2026.assigame.repository.UtilisateurRepository;

@Service
public class ProduitService {
    final ProduitRepository produitRepository;
    final CategorieProduitRepository categorieProduitRepository;
    final UtilisateurRepository utilisateurRepository;

    public ProduitService(ProduitRepository produitRepository,
                           CategorieProduitRepository categorieProduitRepository,
                           UtilisateurRepository utilisateurRepository){
        this.produitRepository = produitRepository;
        this.categorieProduitRepository = categorieProduitRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    public List<Produit> getAllProduit(){
        return produitRepository.findAll();
    }
    
    public Produit createProduit(Produit produit){
        return produitRepository.save(produit);
    }

    public void deleteProduit(Long idProduit){
        produitRepository.deleteById(idProduit);
    }

    public Produit updateProduit(Long idProduit, Produit details){
        Produit produit = produitRepository.findById(idProduit)
         .orElseThrow(() -> 
                 new RuntimeException("Produit not found with id " + idProduit));
    produit.setNom_produit(details.getNom_produit());
    produit.setDescription(details.getDescription());
    produit.setPrix(details.getPrix());

    return produitRepository.save(produit);

    }

    // ==========================================================
    // Méthodes ajoutées pour le frontend (DTOs, recherche, etc.)
    // ==========================================================

    /** Convertit une entité Produit en DTO "plat" pour le frontend. */
    public ProduitResponse toResponse(Produit p) {
        CategorieProduit cat = p.getCategorieProduit();
        Utilisateur u = p.getUtilisateur();
        return new ProduitResponse(
                p.getId_produit(),
                p.getNom_produit(),
                p.getDescription(),
                p.getPrix(),
                p.getImage(),
                p.getDate_ajout(),
                p.getStatut(),
                cat != null ? cat.getIdcategorie_produit() : null,
                cat != null ? cat.getNom_categorieproduit() : null,
                u != null ? u.getId_utilisateur() : null,
                u != null ? u.getNom() : null,
                u != null ? u.getPrenom() : null,
                u != null ? u.getTelephone() : null
        );
    }

    public List<ProduitResponse> getAllProduitResponses() {
        return produitRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProduitResponse getProduitResponseById(Long id) {
        Produit p = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id " + id));
        return toResponse(p);
    }

    public List<ProduitResponse> getProduitsByVendeur(Long idUtilisateur) {
        return produitRepository.findByUtilisateurId(idUtilisateur).stream().map(this::toResponse).toList();
    }

    public List<ProduitResponse> getProduitsByCategorie(Long idCategorie) {
        return produitRepository.findByCategorieId(idCategorie).stream().map(this::toResponse).toList();
    }

    public List<ProduitResponse> searchProduits(String q) {
        return produitRepository.searchByKeyword(q).stream().map(this::toResponse).toList();
    }

    /** Création d'un produit à partir du DTO envoyé par le frontend. */
    public ProduitResponse createFromRequest(ProduitRequest request) {
        CategorieProduit categorie = categorieProduitRepository.findById(request.getIdcategorie_produit())
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec l'id " + request.getIdcategorie_produit()));
        Utilisateur utilisateur = utilisateurRepository.findById(request.getId_utilisateur())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id " + request.getId_utilisateur()));

        Produit produit = new Produit();
        produit.setNom_produit(request.getNom_produit());
        produit.setDescription(request.getDescription());
        produit.setPrix(request.getPrix());
        produit.setImage(request.getImage());
        produit.setStatut(request.getStatut() != null && !request.getStatut().isBlank() ? request.getStatut() : "disponible");
        produit.setDate_ajout(LocalDateTime.now());
        produit.setCategorieProduit(categorie);
        produit.setUtilisateur(utilisateur);

        return toResponse(produitRepository.save(produit));
    }

    /** Mise à jour d'un produit à partir du DTO envoyé par le frontend. */
    public ProduitResponse updateFromRequest(Long id, ProduitRequest request) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id " + id));

        produit.setNom_produit(request.getNom_produit());
        produit.setDescription(request.getDescription());
        produit.setPrix(request.getPrix());
        if (request.getImage() != null) {
            produit.setImage(request.getImage());
        }
        if (request.getStatut() != null && !request.getStatut().isBlank()) {
            produit.setStatut(request.getStatut());
        }
        if (request.getIdcategorie_produit() != null) {
            CategorieProduit categorie = categorieProduitRepository.findById(request.getIdcategorie_produit())
                    .orElseThrow(() -> new RuntimeException("Catégorie non trouvée avec l'id " + request.getIdcategorie_produit()));
            produit.setCategorieProduit(categorie);
        }

        return toResponse(produitRepository.save(produit));
    }

}

