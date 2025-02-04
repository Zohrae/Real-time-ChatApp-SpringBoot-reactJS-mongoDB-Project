package com.example.chatroom.controller;
import com.example.chatroom.entity.Chatroom;
import com.example.chatroom.entity.Message;
import com.example.chatroom.entity.Utilisateur;
import com.example.chatroom.service.MessageService;
import com.example.chatroom.service.UtilisateurService;
import com.example.chatroom.repository.MessageRepository;
import com.example.chatroom.repository.ChatroomRepository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.chatroom.dto.MessageRequest;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatroomRepository chatroomRepository;

    @Autowired
    private UtilisateurService utilisateurService;

    @PostMapping
    public Map<String, String> createMessage(@RequestBody MessageRequest messageRequest) {
        Utilisateur expediteur = utilisateurService.getUtilisateurById(messageRequest.getExpediteurId());
        Optional<Message> messageParent = Optional.empty();
        if (messageRequest.getReplyTo() != null) {
            messageParent = messageRepository.findById(messageRequest.getReplyTo());
        }

        Message message = new Message();
        message.setContenu(messageRequest.getContenu());
        message.setDateEnvoi(LocalDateTime.now());
        message.setExpediteur(expediteur);
        messageParent.ifPresent(message::setMessageParent);

        // Ajout de la référence au chatroom
        Chatroom chatroom = chatroomRepository.findById(messageRequest.getChatroomId())
                                            .orElseThrow(() -> new RuntimeException("Chatroom introuvable: " + messageRequest.getChatroomId()));
        message.setChatroom(chatroom);

        Message savedMessage = messageService.createMessage(message);

        // Formatez la réponse pour inclure l'ID du chatroom et d'autres détails
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return Map.of(
            "id", savedMessage.getId(),
            "nomUtilisateur", savedMessage.getExpediteur().getNom(),
            "contenu", savedMessage.getContenu(),
            "dateEnvoi", savedMessage.getDateEnvoi().format(formatter),
            "chatroomId", savedMessage.getChatroom().getId() // Inclure l'ID du chatroom
        );
    }


    @GetMapping
    public List<Map<String, String>> getAllMessages(@RequestParam String chatroomId) {
        return messageService.getAllMessages(chatroomId)
                            .stream()
                            .map(message -> Map.of(
                                "nomUtilisateur", message.getExpediteur().getNom(),
                                "contenu", message.getContenu(),
                                "dateEnvoi", message.getDateEnvoi().toString() // Inclure la date d'envoi
                            ))
                            .toList();
    }

    @GetMapping("/last-by-user")
    public Map<String, Message> getLastMessagesByUser(@RequestParam String chatroomId) {
        return messageService.getLastMessagesByUser(chatroomId);
    }



}