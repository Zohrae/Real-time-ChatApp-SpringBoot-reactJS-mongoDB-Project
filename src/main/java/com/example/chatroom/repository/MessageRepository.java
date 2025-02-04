package com.example.chatroom.repository;

import com.example.chatroom.entity.Message;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByChatroomId(String chatroomId);
}
