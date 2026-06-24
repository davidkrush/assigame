package com.esgis2026.assigame.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.esgis2026.assigame.entity.Utilisateur;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

    @Query("SELECT u FROM Utilisateur u WHERE u.Email = :identifiant OR u.Login = :identifiant")
    Optional<Utilisateur> findByEmailOrLogin(@Param("identifiant") String identifiant);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Utilisateur u WHERE u.Email = :email")
    boolean existsByEmailIgnoreCaseCustom(@Param("email") String email);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM Utilisateur u WHERE u.Login = :login")
    boolean existsByLoginCustom(@Param("login") String login);

    @Query("SELECT u FROM Utilisateur u LEFT JOIN FETCH u.typeutilisateur")
    java.util.List<Utilisateur> findAllWithTypeUtilisateur();
}
