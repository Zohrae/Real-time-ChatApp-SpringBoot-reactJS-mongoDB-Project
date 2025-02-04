package com.example.chatroom.repository;

import com.example.chatroom.entity.Chatroom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatroomRepository extends MongoRepository<Chatroom, String> {
    // Optionnel : Rechercher une chatroom par son nom
    Chatroom findByName(String name);
}
