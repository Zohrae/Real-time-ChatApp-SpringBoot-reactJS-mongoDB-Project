package com.example.chatroom.repository;

import com.example.chatroom.entity.Utilisateur;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UtilisateurRepository extends MongoRepository<Utilisateur, String> {
    Utilisateur findByLogin(String login);
}
