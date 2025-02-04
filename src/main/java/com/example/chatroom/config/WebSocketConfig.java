package com.example.chatroom.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;
import org.springframework.web.socket.server.support.WebSocketHttpRequestHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.WebSocketSession;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler(), "/chat")
                .addInterceptors(new HttpSessionHandshakeInterceptor()) // Optional, for session data
                .setAllowedOrigins("*"); // Allow all origins (for dev purposes)
    }

    public WebSocketHandler webSocketHandler() {
        return new TextWebSocketHandler() {
            @Override
            public void afterConnectionEstablished(WebSocketSession session) throws Exception {
                sessions.add(session);
                System.out.println("New WebSocket connection: " + session.getId());
            }

            @Override
            public void handleTextMessage(WebSocketSession session, org.springframework.web.socket.TextMessage message) throws Exception {
                // Broadcast the received message to all connected sessions
                synchronized (sessions) {
                    for (WebSocketSession s : sessions) {
                        if (s.isOpen()) {
                            s.sendMessage(message); // Send the message to the client
                        }
                    }
                }
            }

            @Override
            public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
                sessions.remove(session);
                System.out.println("Closed WebSocket connection: " + session.getId());
            }
        };
    }
    
}
