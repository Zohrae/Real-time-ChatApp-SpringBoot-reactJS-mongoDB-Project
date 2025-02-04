package com.example.chatroom.dto;

import com.example.chatroom.entity.Chatroom;

public class MessageRequest {
    private String contenu;
    private String expediteurId; // ID de l'expéditeur
    private String replyTo; // ID du message auquel on répond (optionnel)
    private String chatroomId; // ID de la salle de chat

    // Getters and Setters
    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public String getExpediteurId() {
        return expediteurId;
    }

    public void setExpediteurId(String expediteurId) {
        this.expediteurId = expediteurId;
    }

    public String getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(String replyTo) {
        this.replyTo = replyTo;
    }

    public String getChatroomId() {
        return chatroomId;
    }
    
    public void setChatroomId(String chatroomId) {
        this.chatroomId = chatroomId;
    }
}
