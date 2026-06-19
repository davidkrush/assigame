package com.esgis2026.assigame.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.esgis2026.assigame.dto.ProduitRequest;
import com.esgis2026.assigame.dto.ProduitResponse;
import com.esgis2026.assigame.entity.Produit;
import com.esgis2026.assigame.service.ProduitService;

@RestController
@RequestMapping("/api/produit")
public class ProduitController {

     private final ProduitService produitService;

    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }

    @GetMapping("/list")
    public List<Produit> getAllProduit() {
        return produitService.getAllProduit();
    }

    @PostMapping("/add")
    public Produit addProduit(@RequestBody Produit produit) {
        return produitService.createProduit(produit);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Produit> updateProduit(
            @PathVariable Long id,
            @RequestBody Produit produit) {
        return ResponseEntity.ok(produitService.updateProduit(id, produit));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable Long id) {
        produitService.deleteProduit(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================================================
    // Endpoints ajoutés pour le frontend (DTOs, recherche, etc.)
    // ==========================================================

    /** Liste de tous les produits, format "plat" sans boucle JSON. */
    @GetMapping("/responses")
    public List<ProduitResponse> getAllResponses() {
        return produitService.getAllProduitResponses();
    }

    /** Détail d'un produit. */
    @GetMapping("/{id}")
    public ProduitResponse getProduitById(@PathVariable Long id) {
        return produitService.getProduitResponseById(id);
    }

    /** Produits d'un vendeur donné. */
    @GetMapping("/vendeur/{id}")
    public List<ProduitResponse> getProduitsByVendeur(@PathVariable Long id) {
        return produitService.getProduitsByVendeur(id);
    }

    /** Produits d'une catégorie donnée. */
    @GetMapping("/categorie/{id}")
    public List<ProduitResponse> getProduitsByCategorie(@PathVariable Long id) {
        return produitService.getProduitsByCategorie(id);
    }

    /** Recherche de produits par mot-clé (titre ou description). */
    @GetMapping("/search")
    public List<ProduitResponse> search(@RequestParam("q") String q) {
        return produitService.searchProduits(q);
    }

    /** Création d'un produit via DTO (utilisé par le formulaire frontend). */
    @PostMapping("/create")
    public ResponseEntity<ProduitResponse> create(@RequestBody ProduitRequest request) {
        return ResponseEntity.ok(produitService.createFromRequest(request));
    }

    /** Modification d'un produit via DTO (utilisé par le formulaire frontend). */
    @PutMapping("/update-dto/{id}")
    public ResponseEntity<ProduitResponse> updateDto(@PathVariable Long id, @RequestBody ProduitRequest request) {
        return ResponseEntity.ok(produitService.updateFromRequest(id, request));
    }

}
