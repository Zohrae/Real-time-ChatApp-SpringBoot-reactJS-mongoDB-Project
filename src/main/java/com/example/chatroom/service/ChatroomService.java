package com.example.chatroom.service;

import com.example.chatroom.entity.Chatroom;
import com.example.chatroom.entity.Utilisateur;
import com.example.chatroom.repository.ChatroomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatroomService {

    @Autowired
    private ChatroomRepository chatroomRepository;

    public List<Chatroom> getAllChatrooms() {
        return chatroomRepository.findAll();
    }

    public List<Chatroom> getChatroomsForUser(String userId) {
        return chatroomRepository.findAll().stream()
            .filter(chatroom -> chatroom.getAuthorizedUsers().stream()
                .anyMatch(user -> user.getId().equals(userId)))
            .toList();
    }
    
    public List<Chatroom> getChatroomsForNotUser(String userId) {
        return chatroomRepository.findAll().stream()
            .filter(chatroom -> chatroom.getAuthorizedUsers().stream()
                .noneMatch(user -> user.getId().equals(userId))) // Exclude chatrooms where the user is an authorized user
            .toList();
    }

    public Chatroom getChatroomById(String id) {
        return chatroomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chatroom not found"));
    }

    public Chatroom createChatroom(Chatroom chatroom) {
        if (chatroomRepository.findByName(chatroom.getName()) != null) {
            throw new RuntimeException("Chatroom with this name already exists");
        }
        // Ajouter l'admin à la liste des utilisateurs autorisés s'il n'est pas déjà inclus
        if (!chatroom.getAuthorizedUsers().contains(chatroom.getAdminId())) {
            chatroom.addAuthorizedUser(chatroom.getAdminId());
        }
        return chatroomRepository.save(chatroom);
    }
    

    public void deleteChatroom(String id) {
        chatroomRepository.deleteById(id);
    }

    public boolean isUserAuthorized(String chatroomId, String userId) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId)
            .orElseThrow(() -> new RuntimeException("Chatroom not found"));
        return chatroom.getAuthorizedUsers().stream()
            .anyMatch(user -> user.getId().equals(userId));
    }

    public void quitterChatroom(String chatroomId, String userId) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId)
            .orElseThrow(() -> new RuntimeException("Chatroom not found"));
        
        // Supprimer l'utilisateur de la liste des utilisateurs autorisés
        chatroom.getAuthorizedUsers().removeIf(user -> user.getId().equals(userId));
    
        // Mettre à jour la chatroom dans la base de données
        chatroomRepository.save(chatroom);
    }


    public List<Chatroom> getChatroomsByAdmin(String adminId) {
        return chatroomRepository.findAll().stream()
                .filter(chatroom -> chatroom.getAdminId() != null && chatroom.getAdminId().getId().equals(adminId))
                .toList();
    }

    public void joinChatroom(String chatroomId, String userId) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId)
            .orElseThrow(() -> new RuntimeException("Chatroom not found"));
        // Add the user to the askingUsers list
        chatroom.addAskingUser(new Utilisateur(userId));
        chatroomRepository.save(chatroom);
    }


    public void approveUser(String chatroomId, String userId) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId)
            .orElseThrow(() -> new RuntimeException("Chatroom not found"));
    
        Utilisateur user = chatroom.getAskingUsers().stream()
            .filter(u -> u.getId().equals(userId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("User not found in askingUsers"));
    
        chatroom.getAskingUsers().remove(user); // Remove from askingUsers
        chatroom.getAuthorizedUsers().add(user); // Add to authorizedUsers
        chatroomRepository.save(chatroom); // Save updated chatroom
    }
    
    public boolean isAdmin(String chatroomId, String userId) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId)
            .orElseThrow(() -> new RuntimeException("Chatroom not found"));
        return chatroom.getAdminId() != null && chatroom.getAdminId().getId().equals(userId);
    }
    
    public List<Utilisateur> getAllowedUsersForChatroom(String chatroomId) {
        Chatroom chatroom = chatroomRepository.findById(chatroomId)
            .orElseThrow(() -> new RuntimeException("Chatroom not found"));
        return chatroom.getAuthorizedUsers();
    }

}
