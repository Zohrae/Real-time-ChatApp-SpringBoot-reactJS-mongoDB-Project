package com.example.chatroom.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "utilisateurs")
@TypeAlias("") // Empêche l'ajout du champ _class
public class Utilisateur {
    @Id
    private String id;
    private String nom;
    private String prenom;
    private String email;
    private String login;
    private String mdp;


    // Constructeurs
    public Utilisateur() {}


    // Constructeur avec tous les champs, y compris isAllowed
    public Utilisateur(String nom, String prenom, String email, String login, String mdp) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.login = login;
        this.mdp = mdp;
    }

    public Utilisateur(String id) {
        this.id = id;
    }

    // Getters et setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getMdp() {
        return mdp;
    }

    public void setMdp(String mdp) {
        this.mdp = mdp;
    }

    
}
