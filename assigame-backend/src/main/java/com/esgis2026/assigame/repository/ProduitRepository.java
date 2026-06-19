package com.esgis2026.assigame.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.esgis2026.assigame.entity.Produit;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {

    @Query("SELECT p FROM Produit p WHERE p.utilisateur.id_utilisateur = :idUtilisateur")
    List<Produit> findByUtilisateurId(@Param("idUtilisateur") Long idUtilisateur);

    @Query("SELECT p FROM Produit p WHERE p.categorieProduit.idcategorie_produit = :idCategorie")
    List<Produit> findByCategorieId(@Param("idCategorie") Long idCategorie);

    @Query("SELECT p FROM Produit p WHERE LOWER(p.nom_produit) LIKE LOWER(CONCAT('%', :q, '%')) "
            + "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Produit> searchByKeyword(@Param("q") String q);
}

