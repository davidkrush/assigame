package com.esgis2026.assigame.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.esgis2026.assigame.entity.Utilisateur;
import com.esgis2026.assigame.repository.UtilisateurRepository;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    public List<Utilisateur> getAllUtilisateur() {
        return utilisateurRepository.findAll();
    }

    public java.util.Optional<Utilisateur> getUtilisateurById(Long idUtilisateur) {
        return utilisateurRepository.findById(idUtilisateur);
    }

    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public void deleteUtilisateur(Long idUtilisateur) {
        utilisateurRepository.deleteById(idUtilisateur);
    }

    public Utilisateur updateUtilisateur(Long idUtilisateur, Utilisateur details) {

        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() ->
                        new RuntimeException("Utilisateur not found with id "+ idUtilisateur));

     // Nom/Prenom/Email sont obligatoires (NOT NULL) : on ne les écrase
     // que si une valeur non vide est fournie.
     if (details.getNom() != null && !details.getNom().isBlank()) {
        utilisateur.setNom(details.getNom());
     }
     if (details.getPrenom() != null && !details.getPrenom().isBlank()) {
        utilisateur.setPrenom(details.getPrenom());
     }
     if (details.getEmail() != null && !details.getEmail().isBlank()) {
        utilisateur.setEmail(details.getEmail());
     }
     // Le mot de passe est obligatoire (NOT NULL) : on ne le change
     // que si un nouveau mot de passe non vide est fourni.
     if (details.getMotdepasse() != null && !details.getMotdepasse().isBlank()) {
        utilisateur.setMotdepasse(details.getMotdepasse());
     }
     // Le téléphone est optionnel : on l'accepte même vide.
     if (details.getTelephone() != null) {
        utilisateur.setTelephone(details.getTelephone());
     }

     return utilisateurRepository.save(utilisateur);
    }                 

       


       
}
