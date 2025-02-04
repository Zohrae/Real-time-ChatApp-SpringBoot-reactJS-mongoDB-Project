package com.example.chatroom.controller;

import com.example.chatroom.dto.LoginRequest;
import com.example.chatroom.entity.Utilisateur;
import com.example.chatroom.service.UtilisateurService;
import com.example.chatroom.service.ChatroomService;

import com.example.chatroom.dto.LoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private ChatroomService chatroomService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Utilisateur utilisateur = utilisateurService.authenticateUser(loginRequest.getLogin(), loginRequest.getMdp());

        if (utilisateur != null) {
            String chatroomId = loginRequest.getChatroomId(); // Ajouter cette propriété dans LoginRequest
            if (chatroomId != null) {
                boolean isAuthorized = chatroomService.isUserAuthorized(chatroomId, utilisateur.getId());
                if (!isAuthorized) {
                    return ResponseEntity.status(401).body("Access to the selected chatroom is denied");
                }
            }
            LoginResponse response = new LoginResponse(utilisateur.getId(), utilisateur.getNom(), utilisateur.getEmail());
            return ResponseEntity.ok().body(response);
        } else {
            return ResponseEntity.status(401).body("Invalid login or password");
        }
    }
}