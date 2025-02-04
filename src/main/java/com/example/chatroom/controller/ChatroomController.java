package com.example.chatroom.controller;

import com.example.chatroom.entity.Chatroom;
import com.example.chatroom.entity.Utilisateur;
import com.example.chatroom.service.ChatroomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatrooms")
public class ChatroomController {

    @Autowired
    private ChatroomService chatroomService;

    // Récupérer toutes les chatrooms
    @GetMapping
    public List<Chatroom> getAllChatrooms() {
        return chatroomService.getAllChatrooms();
    }


    @GetMapping("/for-user/{userId}")
    public List<Chatroom> getChatroomsForUser(@PathVariable String userId) {
        return chatroomService.getChatroomsForUser(userId);
    }


    @GetMapping("/for-notuser/{userId}")
    public List<Chatroom> getChatroomsForNotUser(@PathVariable String userId) {
        return chatroomService.getChatroomsForNotUser(userId);
    }



    // Récupérer une chatroom par son ID
    @GetMapping("/{id}")
    public Chatroom getChatroomById(@PathVariable String id) {
        return chatroomService.getChatroomById(id);
    }

    @PostMapping
    public Chatroom createChatroom(@RequestBody Chatroom chatroom) {
        return chatroomService.createChatroom(chatroom);
    }

    // Supprimer une chatroom
    @DeleteMapping("/{id}")
    public void deleteChatroom(@PathVariable String id) {
        chatroomService.deleteChatroom(id);
    }

    @PutMapping("/{chatroomId}/quitter/{userId}")
    public void quitterChatroom(@PathVariable String chatroomId, @PathVariable String userId) {
        chatroomService.quitterChatroom(chatroomId, userId);
    }

    @GetMapping("/admin/{adminId}")
    public List<Chatroom> getChatroomsByAdmin(@PathVariable String adminId) {
        return chatroomService.getChatroomsByAdmin(adminId);
    }

    @PutMapping("/{chatroomId}/join/{userId}")
    public void joinChatroom(@PathVariable String chatroomId, @PathVariable String userId) {
        chatroomService.joinChatroom(chatroomId, userId);
    }

    @PutMapping("/{chatroomId}/approve/{userId}")
    public void approveUser(@PathVariable String chatroomId, @PathVariable String userId) {
        chatroomService.approveUser(chatroomId, userId);
    }

    @GetMapping("/{chatroomId}/is-admin")
    public boolean isAdmin(@PathVariable String chatroomId, @RequestParam String userId) {
        return chatroomService.isAdmin(chatroomId, userId);
    }

    @GetMapping("/{chatroomId}/allowed-users")
    public List<Utilisateur> getAllowedUsers(@PathVariable String chatroomId) {
        Chatroom chatroom = chatroomService.getChatroomById(chatroomId);
        return chatroom.getAuthorizedUsers();
    }

    

}
