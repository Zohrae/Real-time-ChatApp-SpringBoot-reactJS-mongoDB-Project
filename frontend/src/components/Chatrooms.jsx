import React, { useState, useEffect } from "react";

const Chatrooms = () => {
  const [chatroomName, setChatroomName] = useState("");
  const [chatroomDescription, setChatroomDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [askingUsers, setAskingUsers] = useState([]); // Nouvel état pour les utilisateurs demandant l'accès
  const [adminId, setAdminId] = useState(""); // Nouvel état pour l'administrateur
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchChatrooms();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/utilisateurs");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
    }
  };

  const fetchChatrooms = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/chatrooms");
      const data = await response.json();
      setChatrooms(data);
    } catch (error) {
      console.error("Erreur lors du chargement des chatrooms :", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const chatroomResponse = await fetch("http://localhost:8080/api/chatrooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: chatroomName,
          description: chatroomDescription,
          adminId: adminId,
          authorizedUsers: selectedUsers, // Liste des utilisateurs autorisés
          askingUsers: askingUsers, // Liste des utilisateurs demandant l'accès
        }),
      });
      await chatroomResponse.json();

      setChatroomName("");
      setChatroomDescription("");
      setSelectedUsers([]);
      setAskingUsers([]); // Réinitialiser la liste des utilisateurs demandant l'accès
      setAdminId("");
      fetchChatrooms();
    } catch (error) {
      console.error("Erreur lors de la création de la chatroom :", error);
    }
  };

  const handleUserSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedUsers(selectedOptions);
  };

  const handleAskingUserSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setAskingUsers(selectedOptions);
  };

  const handleAdminChange = (e) => {
    setAdminId(e.target.value);
  };

  return (
    <div>
      <h1>Gestion des Chatrooms</h1>

      {/* Formulaire pour ajouter une nouvelle chatroom */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="chatroomName">Nom de la Chatroom :</label>
          <input
            type="text"
            id="chatroomName"
            value={chatroomName}
            onChange={(e) => setChatroomName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="chatroomDescription">Description :</label>
          <textarea
            id="chatroomDescription"
            value={chatroomDescription}
            onChange={(e) => setChatroomDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="admin">Sélectionner l'administrateur :</label>
          <select id="admin" value={adminId} onChange={handleAdminChange} required>
            <option value="">-- Choisir un administrateur --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nom} {user.prenom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="users">Ajouter des utilisateurs autorisés :</label>
          <select id="users" multiple onChange={handleUserSelect} style={{ width: "100%", height: "150px" }}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nom} {user.prenom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="askingUsers">Ajouter des utilisateurs demandant l'accès :</label>
          <select id="askingUsers" multiple onChange={handleAskingUserSelect} style={{ width: "100%", height: "150px" }}>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nom} {user.prenom}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Créer la Chatroom</button>
      </form>

      {/* Liste des chatrooms existantes */}
      <h2>Chatrooms Existantes</h2>
      <ul>
        {chatrooms.map((chatroom) => (
          <li key={chatroom.id}>
            <strong>{chatroom.name}</strong> - {chatroom.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chatrooms;
