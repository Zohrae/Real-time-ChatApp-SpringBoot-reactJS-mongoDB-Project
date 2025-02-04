import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Modal from 'react-modal';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
background-color: #f0f8ff; /* Very light blue */
  }
`;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #e6f7ff; /* Very light blue */
  color: #2e2e2e; /* Dark grey, close to black */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const NavbarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Icon = styled.i`
  font-size: 1.5rem;
  cursor: pointer;
  color: #2e2e2e; /* Black icons */

  &:hover {
    color:rgb(184, 199, 228); /* Light purple hover effect */
  }
`;

const ChatContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding-top: 70px; /* To avoid overlap with the fixed navbar */
`;

const CenteredContainer = styled.div`
  display: flex;
  width: 100%; /* Full width */
  max-width: 1000px; /* Increased max width */
  height: 80vh;
  background-color: #ffffff; /* White */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const AllowedUsersList = styled.div`
  padding: 15px;
  border-right: 1px solid #d1c4e9;
  background-color: #ffffff; /* Couleur de fond neutre */
  width: 270px; /* Largeur fixe pour la liste des utilisateurs */
  border-radius: 8px; /* Bordure arrondie pour une apparence plus soignée */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Ombre légère pour la profondeur */
`;

const UserListTitle = styled.h4`
  color: #0d47a1; /* Bleu plus élégant */
  margin-bottom: 10px;
  font-weight: bold;
  text-align: left; /* Alignement à gauche pour une meilleure lisibilité */
`;

const UserList = styled.ul`
  list-style-type: none; /* Suppression des puces */
  padding-left: 0;
  padding-right: 10px; /* Ajout d'espace à droite pour éviter que le contenu touche la scrollbar */
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px; /* Espacement entre les items */
  align-items: flex-start;

  /* Barre de défilement si trop d'éléments */
  max-height: 400px; /* Hauteur maximale du conteneur */
  overflow-y: auto; /* Activer la barre de défilement verticale */
  overflow-x: hidden; /* Désactiver la barre de défilement horizontale */
  scrollbar-width: thin; /* Réduire la largeur du scrollbar (Firefox) */
  scrollbar-color: rgb(184, 199, 228) #ffffff; /* Couleur de la barre et de l'arrière-plan (Firefox) */

  /* Style pour les navigateurs basés sur WebKit (Chrome, Edge, Safari) */
  &::-webkit-scrollbar {
    width: 8px; /* Largeur de la barre de défilement */
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgb(184, 199, 228); /* Couleur de la barre */
    border-radius: 4px; /* Arrondi pour un design moderne */
  }
  &::-webkit-scrollbar-track {
    background-color: #ffffff; /* Couleur de l'arrière-plan */
  }
`;

const UserListItem = styled.li`
  color: #000000; /* Texte noir */
  font-weight: normal;
  display: flex;
  flex-direction: column; /* Structure principale verticale */
  font-size: 1rem;
  padding: 12px;
  cursor: pointer;
  border-radius: 6px;
  position: relative; /* Nécessaire pour positionner ::after */

  /* Ligne contenant l'heure, le point et le nom */
  .user-header {
    display: flex;
    align-items: center; /* Alignement vertical des éléments dans la ligne */
    justify-content: space-between; /* Répartition espace entre les éléments */
    width: 100%; /* Occuper toute la largeur disponible */
  }

  /* Ligne décorative en bas */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%; /* Laisser un espace vide au centre */
    right: 10%; /* Laisser un espace vide au centre */
    height: 1px; /* Épaisseur de la ligne */
    background-color: #e0e0e0; /* Couleur de la ligne */
  }

  /* Heure actuelle */
  .time {
    font-size: 0.9rem; /* Légèrement plus petit que le nom */
    color: #666; /* Couleur gris clair pour moins de contraste */
    margin-left: auto; /* Pousse l'heure à l'extrémité droite */
  }

  /* Point vert avant le nom */
  .user-header::before {
    content: '';
    width: 8px;
    height: 8px;
    background-color: #4caf50; /* Point vert */
    border-radius: 50%; /* Cercle parfait */
    flex-shrink: 0; /* Garde une taille fixe */
    margin-right: 10px; /* Espacement entre le point et le texte */
  }

  /* Style pour le dernier message */
  .last-message {
    font-size: 0.8rem; /* Taille du texte réduite */
    white-space: nowrap; /* Empêche le retour à la ligne */
    overflow: hidden; /* Cache le dépassement */
    text-overflow: ellipsis; /* Affiche des points de suspension si trop long */
    width: 200px; /* Largeur maximale */
    margin-top: 4px; /* Espacement entre le header et le message */
  }

  &:hover {
    color: #ffffff;
    background-color: #a3c2e7;
    border-radius: 8px;
    padding: 14px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color:rgb(220, 229, 248);
  border-bottom: 1px solidrgb(32, 19, 57);
`;

const MessageArea = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fafafa;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 15px;
  word-wrap: break-word;
  align-self: ${(props) => (props.isSender ? 'flex-end' : 'flex-start')};
  background-color: ${(props) => (props.isSender ? '#e3f2fd' : '#bbdefb')};
  color: ${(props) => (props.isSender ? '#0d47a1' : '#1565c0')};
  position: relative;
  cursor: pointer;
  margin-left: ${(props) => (props.isSender ? 'auto' : '0')};
  margin-right: ${(props) => (props.isSender ? '0' : 'auto')};
  display: flex; /* Ensuring flex properties apply consistently */
  flex-direction: column; /* Added for flex behavior consistency */

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    ${(props) => (props.isSender ? 'right: -5px;' : 'left: -5px;')}
    width: 10px;
    height: 10px;
    background-color: inherit;
    clip-path: polygon(50% 0, 0% 100%, 100% 100%);
  }
`;


const ReplyTag = styled.div`
  font-size: 0.9rem;
  color: #616161;
  margin-bottom: 5px;
  font-style: italic;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  background-color: #ffffff;
  border-top: 1px solid #ced4da;
`;

const InputField = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 15px;
  margin-right: 10px;
  outline: none;
  transition: border 0.3s ease;

  &:focus {
    border-color: #6580b8;
    outline: none;
  }
`;

const SendButton = styled.button`
  padding: 10px 20px;
  background: none;
  color: white;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.1s ease-in-out; /* Transition pour le survol */
  outline: none; /* Réinitialiser l'effet de contour en mode focus */

  &:focus {
    outline: none; /* Réinitialiser l'effet de contour en mode focus */
  }

  img {
    width: 35px; /* Largeur de l'icône */
    display: inline-block; /* Permet d'utiliser l'icône avec la même disposition que le texte */
  }

  &:hover img {
    transform: scale(1.2); /* Petite animation de zoom */
  }

  &:focus img {
    outline: none; /* Réinitialiser l'effet de contour en mode focus */
  }
`;




const Title = styled.h1`
  font-family: 'Brush Script MT', cursive;
  font-size: 3rem; /* Taille plus grande pour un titre large */
  color: black; /* Couleur noire */
  text-align: center;
  cursor: pointer; /* Curseur de main par défaut */
  
  &:hover {
    cursor: pointer; /* Maintient le curseur en main lorsqu'on survole */
  }
`;


const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px; /* Espacement vertical entre les boutons */
  align-items: flex-start; /* Aligné à gauche */
`;

const IconModal = styled.img`
  width: 20px; /* Largeur des icônes */
  margin-right: 10px;
`;

const MenuButton = styled.button`
  background: url('/img/dots.png') no-repeat center;
  background-size: contain; /* Remplir l'icône sans espace */
  width: 24px; /* Plus petite largeur */
  height: 24px; /* Plus petite hauteur */
  border: none;
  cursor: pointer;
  position: relative; /* Ajout de la position relative */
  outline: none; /* Supprime l'effet de contour par défaut */
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    outline: none; /* Réinitialiser l'effet de contour sur le survol */
  }
  &:focus {
    outline: none; /* Réinitialiser l'effet de contour en mode focus */
  }
`;

const EditButton = styled.button`
  background: url('/img/editchat.png') no-repeat center;
  background-size: contain; /* Remplir l'icône sans espace */
  width: 30px; /* Plus petite largeur */
  height: 30px; /* Plus petite hauteur */
  border: none;
  cursor: pointer;
  position: relative; /* Ajout de la position relative */
  outline: none; /* Supprime l'effet de contour par défaut */
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    outline: none; /* Réinitialiser l'effet de contour sur le survol */
  }
  &:focus {
    outline: none; /* Réinitialiser l'effet de contour en mode focus */
  }
`;


const LeaveButton = styled.button`
  background: url('/img/leave.png') no-repeat center;
  background-size: contain; /* Remplir l'icône sans espace */
  width: 35px; /* Plus petite largeur */
  height: 35px; /* Plus petite hauteur */
  border: none;
  cursor: pointer;
  position: relative; /* Ajout de la position relative */
  outline: none; /* Supprime l'effet de contour par défaut */
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    outline: none; /* Réinitialiser l'effet de contour sur le survol */
  }
  &:focus {
    outline: none; /* Réinitialiser l'effet de contour en mode focus */
  }
`;
const ProfilButton = styled.button`
  border: none;
  background: transparent;
  outline: none; // Supprime l'outline par défaut
  transition: background-color 0.3s ease;
  width: 140px;
  &:hover {
    background-color:rgb(220, 242, 250); // Teinte bleue claire avec code hexadécimal
  }
    &:focus {
    outline: none; 
  }
`;


const Chat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const messageAreaRef = useRef(null);
  const [allowedUsers, setAllowedUsers] = useState([]);
  const [isProfilModalOpen, setIsProfilModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [newChatroom, setNewChatroom] = useState({
    name: '',
    description: '',
    adminId: localStorage.getItem('userId'),
    authorizedUsers: [],
  });

  const [allUsers, setAllUsers] = useState([]);


  useEffect(() => {
    const chatroomId = localStorage.getItem('chatroomId');
    if (!chatroomId) {
      console.error('Chatroom ID is missing');
      navigate('/profil');
    }
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const chatroomId = localStorage.getItem('chatroomId'); // Retrieve the chatroom ID

    if (!userId || !userName) {
      navigate('/login');
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/messages?chatroomId=${chatroomId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Erreur lors de la récupération des messages');
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchMessages();

    const ws = new WebSocket(`ws://localhost:8080/chat?chatroomId=${chatroomId}`); // Include chatroom ID in the WebSocket URL
    ws.onopen = () => console.log('WebSocket connecté');
    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, receivedMessage];
        return updatedMessages;
      });
    };
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [navigate]);

  useEffect(() => {
    if (messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleDoubleClick = (message) => {
    setReplyTo(message);
    setMessage(`@${message.nomUtilisateur}: `);
  };

  const sendMessage = async () => {
    if (message.trim() && socket) {
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const chatroomId = localStorage.getItem('chatroomId'); // Récupération de l'ID du chatroom
        const currentDate = new Date().toISOString();

        const messagePayload = {
            contenu: message,
            expediteurId: userId,
            chatroomId: chatroomId, // Envoi de l'ID du chatroom
            dateEnvoi: currentDate,
            replyTo: replyTo ? replyTo.id : null,
        };

        try {
            const response = await fetch('http://localhost:8080/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messagePayload),
            });

            if (response.ok) {
                const savedMessage = await response.json();
                socket.send(JSON.stringify(savedMessage));
                setMessage('');
                setReplyTo(null);
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi du message :", error);
        }
    }
};


useEffect(() => {
  const fetchAllowedUsers = async () => {
    try {
      const chatroomId = localStorage.getItem('chatroomId');
      const response = await fetch(`http://localhost:8080/api/chatrooms/${chatroomId}/allowed-users`);
      if (response.ok) {
        const data = await response.json();
        setAllowedUsers(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs autorisés:', error);
    }
  };
  fetchAllowedUsers();
}, []);



  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };


  const OpenProfilModal = async () => {
    setIsProfilModalOpen(true);
  };
  
  const closeProfilModal = () => setIsProfilModalOpen(false);

  
  const OpenMenuModal = () => {
    setIsMenuOpen(true);
  };
  
  const closeMenuModal = () => {
    setIsMenuOpen(false);
  };
  
  const handleAction = (action) => {
    closeMenuModal();
    switch (action) {
      case 'create':
        openCreationModal(); // Ouvrir CreationModal
        break;
      case 'leave':
        // Logic to leave chatroom
        break;
      case 'logout':
        logout(); // Call your logout function
        break;
      default:
        break;
    }
  };

  const leaveChatroom = async () => {
    const confirmLeave = window.confirm("Êtes-vous sûr de vouloir quitter cette chatroom ?");
    
    if (!confirmLeave) {
        return; // Ne rien faire si l'utilisateur annule
    }

    const userId = localStorage.getItem('userId');
    const chatroomId = localStorage.getItem('chatroomId');
  
    try {
        const response = await fetch(`http://localhost:8080/api/chatrooms/${chatroomId}/quitter/${userId}`, {
            method: 'PUT',
        });
  
        if (response.ok) {
            localStorage.removeItem('chatroomId'); // Supprime l'ID de la chatroom de localStorage
            navigate('/profil');
        } else {
            console.error('Erreur lors de la tentative de quitter la chatroom');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
};


  const openCreationModal = () => {
    setIsCreationModalOpen(true);
  };
  
  const closeCreationModal = () => {
    setIsCreationModalOpen(false);
  };
  
  const addChatroom = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/chatrooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newChatroom),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Error creating chatroom');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewChatroom((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserSelection = (userId, selected) => {
    setNewChatroom((prev) => {
      const updatedUsers = selected
        ? [...prev.authorizedUsers, userId]
        : prev.authorizedUsers.filter((id) => id !== userId);
      return { ...prev, authorizedUsers: updatedUsers };
    });
  };
  
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/utilisateurs');
        if (response.ok) {
          const data = await response.json();
          setAllUsers(data);
        } else {
          console.error('Error fetching users');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchUsers();
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const chatroomId = localStorage.getItem('chatroomId');
      const userId = localStorage.getItem('userId');
      try {
        const response = await fetch(`http://localhost:8080/api/chatrooms/${chatroomId}/is-admin?userId=${userId}`);
        if (response.ok) {
          const isAdmin = await response.json();
          setIsAdmin(isAdmin);
        } else {
          setIsAdmin(false); // S'assurer que isAdmin est toujours un booléen même si la requête échoue.
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'administrateur:', error);
        setIsAdmin(false); // Traiter toute erreur en définissant isAdmin à false.
      }
    };

    checkAdminStatus();
  }, []);



  

  return (
    <ChatContainer>
      <GlobalStyle />
      <Navbar>
        <Title onClick={() => navigate('/chat')}>Chat Application</Title>
        <NavbarItem>
          <Icon className="fas fa-bell" title="Notifications"></Icon>
          <Icon className="fas fa-user" title="Profil" onClick={OpenProfilModal}></Icon>
        </NavbarItem>
      </Navbar>
      <CenteredContainer>
      <AllowedUsersList>
          <UserListTitle>Connected</UserListTitle>
          <UserList>
            {allowedUsers.map((user) => (
              <UserListItem key={user.id}>
                {/* Ligne contenant l'heure, le point et le texte */}
                <div className="user-header">
                  <span>
                    {user.prenom} {user.nom}
                  </span>
                  <span className="time">
                    {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {/* Dernier message en dessous */}
                <span className="last-message">
                  This is the last message for this user
                </span>
              </UserListItem>
            ))}
          </UserList>
        </AllowedUsersList>


        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header>
            <Title>Chat</Title>
            {isAdmin ? (
              <EditButton onClick={() => openEditModal()}/>
                  ) : (
                <LeaveButton onClick={leaveChatroom}/>              
              )}
              <MenuButton onClick={OpenMenuModal} />

            </Header>
            <MessageArea ref={messageAreaRef}>
              {messages.map((message) => (
                <MessageBubble
                key={message.id}
                isSender={message.nomUtilisateur === localStorage.getItem('userName')}
                onDoubleClick={() => handleDoubleClick(message)}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{message.nomUtilisateur}</div> {/* Nom de l'expéditeur */}
                {message.replyTo && (
                  <ReplyTag>Réponse à @{message.replyTo.nomUtilisateur}</ReplyTag>
                )}
                {message.contenu}
                <div style={{ fontSize: '0.8rem', color: '#616161', marginTop: '5px', textAlign: 'right' }}>
                  {new Date(message.dateEnvoi).toLocaleString()} {/* Date d'envoi */}
                </div>
              </MessageBubble>
              
              ))}
            </MessageArea>
          <InputContainer>
            <InputField
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <SendButton onClick={sendMessage}>
              <img src="/img/send.png" alt="Send" />
            </SendButton>
          </InputContainer>
        </div>
      </CenteredContainer>

      <Modal
          isOpen={isProfilModalOpen}
          onRequestClose={closeProfilModal}
          style={{
            overlay: {
              backgroundColor: 'transparent', // Supprime l'effet de superposition grisé
            },
            content: {
              top: '28.5%',
              left: '93%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: 'auto',
              backgroundColor: 'white', // Supprime le fond
              pointerEvents: 'auto', // Permet les interactions dans le modal
            },
          }}
          shouldCloseOnOverlayClick={false} // Empêche la fermeture du modal au clic sur l'arrière-plan
        >
          <button
            onClick={closeProfilModal}
            style={{
              border: 'none',
              background: 'transparent',
              position: 'absolute',
              top: '1px',
              right: '0px',
              outline: 'none',
            }}
          >
            <img src="/img/x.png" alt="Close" style={{ width: '25px', height: '25px', outline: 'none' }} />
          </button>

          <ButtonGroup style={{ marginTop: '30px' }}>
            <ProfilButton>
              <IconModal src="/img/settings.png" alt="Settings" /> Settings
            </ProfilButton>
            <ProfilButton onClick={() => navigate('/profil')}>
              <IconModal src="/img/profil.png" alt="Profile" /> Profile
            </ProfilButton>
            <ProfilButton onClick={logout}>
              <IconModal src="/img/logout.png" alt="LogOut" /> LogOut
            </ProfilButton>
          </ButtonGroup>
        </Modal>

        <Modal isOpen={isMenuOpen} onRequestClose={closeMenuModal} style={{
            overlay: {
              backgroundColor: 'transparent', // Supprime l'effet de superposition grisé
            },
            content: {
              width: '200px',
              backgroundColor: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              padding: '15px',
              position: 'relative', /* Maintenir la position absolue */
              left: '70%', 
              top: '27%',
              display: 'flex',
              flexDirection: 'column', /* Aligner verticalement les boutons */
              alignItems: 'flex-start', /* Alignement du texte à gauche */
              gap: '10px', /* Espacement entre les boutons */
              pointerEvents: 'auto', // Permet les interactions dans le modal

            }
          }}>
            <button onClick={() => handleAction('create')} style={{ background: 'none', display: 'flex', alignItems: 'center', outline: 'none' }}>
              <img src="/img/create.png" alt="Créer" style={{ width: '15px', height: '15px', marginRight: '8px' }} />
              Create
            </button>
            <button onClick={leaveChatroom} style={{ background: 'none', display: 'flex', alignItems: 'center', outline: 'none' }}>
              <img src="/img/leave.png" alt="Quitter" style={{ width: '15px', height: '15px', marginRight: '8px' }} />
              Leave
            </button>
            <button onClick={() => handleAction('logout')} style={{ background: 'none', display: 'flex', alignItems: 'center', outline: 'none' }}>
              <img src="/img/logout.png" alt="Déconnexion" style={{ width: '15px', height: '15px', marginRight: '8px' }} />
              LogOut
            </button>
        </Modal>

        <Modal isOpen={isCreationModalOpen} onRequestClose={closeCreationModal}
              style={{
                // overlay: {
                //   backgroundColor: 'transparent', // Supprime l'effet de superposition grisé
                // },
                content: {
                  width: '500px',
                  backgroundColor: 'WHITE',
                  borderRadius: '10px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  padding: '15px',
                  position: 'relative',
                  left: '35%', 
                  top: '24%',
                }
              }}>
            <div className="modal-content" style={{ maxWidth: '500px' }}>
              <div className="modal-header">
                <h2>Create Chatroom</h2>
                <button
                  onClick={closeCreationModal}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    position: 'absolute',
                    top: '1px',
                    right: '0px',
                    outline: 'none',
                  }}
                >
                  <img src="/img/x.png" alt="Close" style={{ width: '25px', height: '25px' }} />
                </button>
            </div>
              <div className="modal-body">
                <input
                  type="text"
                  name="name"
                  placeholder="Chatroom Name"
                  value={newChatroom.name}
                  onChange={handleInputChange}
                  style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }}
                />
                <textarea
                  name="description"
                  placeholder="Chatroom Description"
                  value={newChatroom.description}
                  onChange={handleInputChange}
                  style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', height: '60px', outline: 'none' }}
                />
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {allUsers.map((user) => (
                  <div key={user.id} style={{ marginBottom: '10px' }}>
                    <input
                      type="checkbox"
                      id={`user-${user.id}`}
                      value={user.id}
                      checked={newChatroom.authorizedUsers.includes(user.id)}
                      onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                      style={{ marginRight: '8px', outline: 'none' }}
                    />
                    <label htmlFor={`user-${user.id}`}>
                      {user.nom} {user.prenom}
                    </label>
                  </div>
                ))}
          </div>
          <button onClick={addChatroom} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', borderRadius: '4px', border: 'none', marginTop: '10px' }}>
            Create
          </button>
        </div>
      </div>
    </Modal>

    
    </ChatContainer>
  );
};

export default Chat;