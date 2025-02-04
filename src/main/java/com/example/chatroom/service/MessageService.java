package com.example.chatroom.service;

import com.example.chatroom.dto.MessageRequest;
import com.example.chatroom.entity.Chatroom;
import com.example.chatroom.entity.Message;
import com.example.chatroom.entity.Utilisateur;
import com.example.chatroom.repository.ChatroomRepository;
import com.example.chatroom.repository.MessageRepository;
import com.example.chatroom.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private ChatroomRepository chatroomRepository; // Assurez-vous d'avoir ce repository


    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public List<Message> getAllMessages(String chatroomId) {
        return messageRepository.findByChatroomId(chatroomId);
    }

    public Message getMessageById(String id) {
        return messageRepository.findById(id).orElse(null);
    }

    public Message createMessage(Message message) {
        return messageRepository.save(message);
    }

    public void deleteMessage(String id) {
        messageRepository.deleteById(id);
    }

    public Message sendMessage(MessageRequest messageRequest) {
        Optional<Utilisateur> expediteur = utilisateurRepository.findById(messageRequest.getExpediteurId());
        Optional<Chatroom> chatroom = chatroomRepository.findById(messageRequest.getChatroomId());
    
        if (!expediteur.isPresent()) {
            throw new RuntimeException("Utilisateur introuvable: " + messageRequest.getExpediteurId());
        }
        if (!chatroom.isPresent()) {
            throw new RuntimeException("Chatroom introuvable: " + messageRequest.getChatroomId());
        }
    
        Message message = new Message();
        message.setContenu(messageRequest.getContenu());
        message.setDateEnvoi(LocalDateTime.now());
        message.setExpediteur(expediteur.get());
        message.setChatroom(chatroom.get());
    
        if (messageRequest.getReplyTo() != null) {
            messageRepository.findById(messageRequest.getReplyTo()).ifPresent(message::setMessageParent);
        }
    
        return messageRepository.save(message);
    }
    
    
    public Message sendMessage(Message message) {
        return messageRepository.save(message); // Sauvegarde le message avec la référence à l'utilisateur
    }

    public Map<String, Message> getLastMessagesByUser(String chatroomId) {
        List<Message> messages = messageRepository.findByChatroomId(chatroomId);
        Map<String, Message> lastMessages = new HashMap<>();

        for (Message message : messages) {
            String userId = message.getExpediteur().getId();
            if (!lastMessages.containsKey(userId) || message.getDateEnvoi().isAfter(lastMessages.get(userId).getDateEnvoi())) {
                lastMessages.put(userId, message);
            }
        }

        return lastMessages;
    }
    
}