import React, { useEffect, useState } from 'react';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [newMessage, setNewMessage] = useState({
        contenu: '',
        expediteur: ''
    });

    // Récupérer les messages depuis le backend
    useEffect(() => {
        fetch('http://localhost:8080/api/messages')
            .then(response => response.json())
            .then(data => setMessages(data))
            .catch(error => console.error('Erreur lors de la récupération des messages:', error));
    }, []);

    // Récupérer les utilisateurs depuis le backend
    useEffect(() => {
        fetch('http://localhost:8080/api/utilisateurs')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Erreur lors de la récupération des utilisateurs:', error));
    }, []);

    // Gestion de l'envoi du formulaire
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMessage({
            ...newMessage,
            [name]: value
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMessage),
        })
            .then(response => response.json())
            .then(data => {
                setMessages([...messages, data]); // Ajoute le nouveau message à la liste
                setNewMessage({ contenu: '', expediteur: '' }); // Réinitialise le formulaire
            })
            .catch(error => console.error('Erreur lors de l\'ajout du message:', error));
    };

    return (
        <div>
            <h2>Liste des Messages</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        <strong>De :</strong> {message.expediteur.nom} {message.expediteur.prenom} |
                        <strong> Message :</strong> {message.contenu}
                    </li>
                ))}
            </ul>

            <h3>Envoyer un Nouveau Message</h3>
            <form onSubmit={handleFormSubmit}>
                <textarea
                    name="contenu"
                    placeholder="Entrez votre message"
                    value={newMessage.contenu}
                    onChange={handleInputChange}
                    required
                />
                <select
                    name="expediteur"
                    value={newMessage.expediteur}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Sélectionnez l'expéditeur</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.nom} {user.prenom}
                        </option>
                    ))}
                </select>
                <button type="submit">Envoyer</button>
            </form>
        </div>
    );
};

export default Messages;
