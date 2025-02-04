import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Users from './components/Users';
import Messages from './components/Messages';
import Login from './components/Login';
import Chat from './components/Chat';
import Chatrooms from './components/Chatrooms';
import Profil from './components/Profil';
import MyChats from './components/MyChat';
import Chats from './components/Chats';
import Register from './components/Register';


function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/users" element={<Users />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/chatrooms" element={<Chatrooms />} />
                    <Route path="/profil" element={<Profil />} />
                    <Route path="/mychats" element={<MyChats />} />
                    <Route path="/chats" element={<Chats />} />
                    <Route path="/register" element={<Register />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
