package com.example.chatroom.controller;

import com.example.chatroom.dto.MessageRequest;
import com.example.chatroom.entity.Message;
import com.example.chatroom.entity.Utilisateur;
import com.example.chatroom.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
@Controller
public class WebSocketController {

    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat") 
    @SendTo("/topic/messages")
    public Message handleMessage(Message message) {
        message.setDateEnvoi(LocalDateTime.now());
        return messageService.createMessage(message); 
    }

}
