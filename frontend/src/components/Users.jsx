import React, { useEffect, useState } from 'react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        nom: '',
        prenom: '',
        email: '',
        login: '',
        mdp: '',
        role: 'USER', // Rôle par défaut
    });

    useEffect(() => {
        fetch('http://localhost:8080/api/utilisateurs') // Remplacez par l'URL de votre backend si différent
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) =>
                console.error('Erreur lors de la récupération des utilisateurs:', error)
            );
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({
            ...newUser,
            [name]: value,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8080/api/utilisateurs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
            .then((response) => response.json())
            .then((data) => {
                setUsers([...users, data]); // Ajoute le nouvel utilisateur à la liste
                setNewUser({
                    nom: '',
                    prenom: '',
                    email: '',
                    login: '',
                    mdp: '',
                    role: 'USER', // Réinitialise avec le rôle par défaut
                });
            })
            .catch((error) =>
                console.error("Erreur lors de l'ajout de l'utilisateur:", error)
            );
    };

    return (
        <div>
            <h2>Liste des Utilisateurs</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.nom} {user.prenom} - {user.email} (Login: {user.login}, Rôle: {user.role})
                    </li>
                ))}
            </ul>

            <h3>Ajouter un Utilisateur</h3>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    value={newUser.nom}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="prenom"
                    placeholder="Prénom"
                    value={newUser.prenom}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="login"
                    placeholder="Login"
                    value={newUser.login}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="mdp"
                    placeholder="Mot de passe"
                    value={newUser.mdp}
                    onChange={handleInputChange}
                    required
                />
                <select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                >
                    <option value="USER">Utilisateur</option>
                    <option value="ADMIN">Administrateur</option>
                </select>
                <button type="submit">Ajouter</button>
            </form>
        </div>
    );
};

export default Users;
