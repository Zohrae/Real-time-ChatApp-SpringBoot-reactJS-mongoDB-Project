package com.example.chatroom.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String contenu;
    private LocalDateTime dateEnvoi;
    private Message messageParent; // Référence au message auquel l'utilisateur répond


    @DBRef
    private Utilisateur expediteur; // Référence à l'utilisateur qui envoie le message

    @DBRef
    private Chatroom chatroom; // Reference to the chatroom

    // Constructeurs
    public Message() {}

    public Message(String contenu, LocalDateTime dateEnvoi, Utilisateur expediteur, Message messageParent, Chatroom chatroom) {
        this.contenu = contenu;
        this.dateEnvoi = dateEnvoi;
        this.expediteur = expediteur;
        this.messageParent = messageParent;
        this.chatroom = chatroom;

    }

    // Getters et Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public LocalDateTime getDateEnvoi() {
        return dateEnvoi;
    }

    public void setDateEnvoi(LocalDateTime dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }

    public Utilisateur getExpediteur() {
        return expediteur;
    }

    public void setExpediteur(Utilisateur expediteur) {
        this.expediteur = expediteur;
    }

    public Message getMessageParent() {
        return messageParent;
    }

    public void setMessageParent(Message messageParent) {
        this.messageParent = messageParent;
    }

    public Chatroom getChatroom() {
        return chatroom;
    }

    public void setChatroom(Chatroom chatroom) {
        this.chatroom = chatroom;
    }
}
