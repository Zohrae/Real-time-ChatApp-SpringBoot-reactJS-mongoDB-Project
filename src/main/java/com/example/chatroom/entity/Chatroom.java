package com.example.chatroom.entity;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

@Document(collection = "chatrooms")
public class Chatroom {
    @Id
    private String id;
    private String name;
    private String description;

    @DBRef
    private Utilisateur admin; // Référence à l'objet utilisateur

    @DBRef
    private List<Utilisateur> authorizedUsers = new ArrayList<>(); // Utilisateurs autorisés

    @DBRef
    private List<Utilisateur> askingUsers = new ArrayList<>(); // Utilisateurs ayant demandé l'accès

    // Constructeurs
    public Chatroom() {}

    public Chatroom(String name, String description, Utilisateur admin, List<Utilisateur> authorizedUsers, List<Utilisateur> askingUsers) {
        this.name = name;
        this.description = description;
        this.admin = admin;
        this.authorizedUsers = authorizedUsers;
        this.askingUsers = askingUsers;
    }

    public List<Utilisateur> getAuthorizedUsers() {
        return authorizedUsers;
    }

    public void setAuthorizedUsers(List<Utilisateur> authorizedUsers) {
        this.authorizedUsers = authorizedUsers;
    }

    public void addAuthorizedUser(Utilisateur utilisateur) {
        this.authorizedUsers.add(utilisateur);
    }

    public List<Utilisateur> getAskingUsers() {
        return askingUsers;
    }

    public void setAskingUsers(List<Utilisateur> askingUsers) {
        this.askingUsers = askingUsers;
    }

    public void addAskingUser(Utilisateur utilisateur) {
        this.askingUsers.add(utilisateur);
    }

    // Getters et setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Utilisateur getAdminId() {
        return admin;
    }

    public void setAdminId(Utilisateur admin) {
        this.admin = admin;
    }


}
