package com.example.chatroom.controller;

import com.example.chatroom.entity.Utilisateur;
import com.example.chatroom.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurService.getAllUtilisateurs();
    }

    @GetMapping("/{id}")
    public Utilisateur getUtilisateurById(@PathVariable String id) {
        return utilisateurService.getUtilisateurById(id);
    }

    @PostMapping
    public Utilisateur createUtilisateur(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.createUtilisateur(utilisateur);
    }

    @DeleteMapping("/{id}")
    public void deleteUtilisateur(@PathVariable String id) {
        utilisateurService.deleteUtilisateur(id);
    }

    // Endpoint pour récupérer un utilisateur par login
    @GetMapping("/login/{login}")
    public Utilisateur getUtilisateurByLogin(@PathVariable String login) {
        return utilisateurService.getUtilisateurByLogin(login);
    }


    

}
