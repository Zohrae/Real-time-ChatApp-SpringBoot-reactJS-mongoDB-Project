package com.example.chatroom.service;

import com.example.chatroom.entity.Utilisateur;
import com.example.chatroom.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur getUtilisateurById(String id) {
        return utilisateurRepository.findById(id).orElse(null);
    }

    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public void deleteUtilisateur(String id) {
        utilisateurRepository.deleteById(id);
    }

    // Méthode pour trouver un utilisateur par login
    public Utilisateur getUtilisateurByLogin(String login) {
        return utilisateurRepository.findByLogin(login);
    }

    public Utilisateur authenticateUser(String login, String mdp) {
        // Rechercher l'utilisateur par login
        Utilisateur utilisateur = utilisateurRepository.findByLogin(login);

        // Vérifier si l'utilisateur existe, le mot de passe est correct, et si l'utilisateur est autorisé à se connecter
        if (utilisateur != null && utilisateur.getMdp().equals(mdp)) {
            return utilisateur; // Retourner l'utilisateur si l'authentification réussit
        }
        return null; // Retourner null si l'utilisateur ou le mot de passe est incorrect ou si l'utilisateur n'est pas autorisé
    }

    
}
