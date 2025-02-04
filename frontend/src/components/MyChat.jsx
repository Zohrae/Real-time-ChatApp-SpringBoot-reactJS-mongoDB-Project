import React, { useState, useEffect } from 'react';
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
    color:rgb(181, 216, 232); /* Light purple hover effect */
  }
`;

const ProfilContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding-top: 70px; /* To avoid overlap with the fixed navbar */
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

const ChatroomContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px; /* Increased gap between chatrooms */
  margin-top: 20px;
  justify-content: center;
`;

const ChatroomItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px; /* Larger size for each chatroom */
  padding: 15px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  text-align: center;
  position: relative; /* Positioning relative to add edit icon */
`;

const EditIcon = styled.img`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const ChatroomImage = styled.img`
  width: 200px; /* Even larger image size */
  height: 200px; /* Even larger image size */
  object-fit: cover;
  border-radius: 5px;
`;

const Footer = styled.footer`
  width: 100%;
  padding: 10px;
  text-align: center;
  background-color: #e6f7ff; /* Very light purple */
  color: #2e2e2e; /* Dark grey */
  position: fixed;
  bottom: 0;
`;

const ChatroomContainerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #e6f7ff;
  color: #2e2e2e;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: rgb(181, 216, 232);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PreviousButton = styled(NavigationButton)`
  left: 10px;
`;

const NextButton = styled(NavigationButton)`
  right: 10px;
`;

const HeaderTitle = styled.h2`
  font-family: 'Monotype Corsiva', cursive;
  font-size: 2.6rem; /* Balanced size for prominence */
  color: #2e2e2e; /* Dark grey for modern contrast */
  margin-bottom: 20px;
  text-align: center;
  letter-spacing: 1px; /* Adds spacing for a polished look */
  font-weight: 500; /* Medium weight for balanced elegance */
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0%; /* Initial width is zero to hide the line */
    height: 2px; /* Light blue line */
    background-color: #add8e6; /* Light blue color */
    animation: slideIn 4s ease-in-out infinite; /* Animation */
  }

  @keyframes slideIn {
    from {
      width: 0%;
    }
    to {
      width: 100%;
    }
  }
`;

const Sidebar = styled.div`
  position: absolute;
  top: 25%;
  left: 0;
  transform: translateY(-50%);
  background-color: #e6f7ff;
  width: 160px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const SidebarButton = styled.button`
  background-color: #a5d8ff;
  color: #2e2e2e;
  border: none;
  border-radius: 12px;
  margin: 10px 0;
  width: 150px;
  height: 40px;
  cursor: pointer !important; /* Force le curseur pointer */
  transition: background-color 0.3s ease, transform 0.3s ease;
  outline: none;

  &:hover {
    background-color: #91c9f7;
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    outline: none; 
  }
`;

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px; /* Espacement entre chaque élément */
  overflow-y: auto; /* Barre de défilement verticale si nécessaire */
  width: 100%;
  max-height: 80vh; /* Limite la hauteur pour forcer l'overflow si le contenu est trop grand */
  padding: 10px; /* Ajouter un peu d'espace intérieur */
  background-color: #f9fcff; /* Fond bleu très clair comme StyledTable */
  border: 1px solid #e0e0e0; /* Bordure légère */
  border-radius: 8px; /* Coins arrondis */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Ombre subtile */
  
  /* Styles pour la barre de défilement */
  &::-webkit-scrollbar {
    width: 8px; /* Largeur de la scrollbar */
  }

  &::-webkit-scrollbar-track {
    background: #edf7fc; /* Couleur de fond de la scrollbar */
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #aad8e6; /* Bleu doux pour le curseur */
    border-radius: 8px;
    border: 2px solid #f9fcff; /* Ajout d'une bordure pour créer un effet d'espace */
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #d6eefc; /* Bleu plus prononcé au survol */
  }
`;


const StyledModal = styled(Modal)`
  width: 400px;
  height: 400px; /* Limite la hauteur du modal */
  background-color: #e0f7fa;
  color: #2e2e2e;
  border-radius: 10px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;



const ModalHeader = styled.h2`
  font-family: 'Monotype Corsiva', cursive;
  font-size: 1.8rem; /* Smaller for modals */
  margin-bottom: 15px;
`;

const CloseButton = styled.button`
  background-color:rgb(150, 192, 205); /* Darker blue for close button */
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  outline: none;
  &:hover {
    background-color:rgb(158, 216, 234); /* Darker shade on hover */
  }
    &:focus {
    outline: none; 
  }
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #aad8e6; /* Blue border */
  border-radius: 5px;
  font-size: 1rem;
  color: #2e2e2e; /* Dark grey text */
  outline: none;
  &:focus {
    outline: none; 
  }
`;



const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background-color: #f9fcff; /* Very light blue background */
  border-radius: 8px; /* Rounded corners */
  overflow: hidden; /* Prevent border overflow */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */

  th, td {
    text-align: left;
    padding: 12px; /* Increase padding for better readability */
    border-bottom: 1px solid #e0e0e0; /* Light grey borders */
  }

  th {
    background-color: #aad8e6; /* Soft blue */
    color: #2e2e2e; /* Dark grey text */
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #edf7fc; /* Slightly lighter blue for alternating rows */
  }

  tr:hover {
    background-color: #d6eefc; /* Highlight row on hover */
  }
`;


const MyChats = () => {
  const navigate = useNavigate();
  const [chatrooms, setChatrooms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Index pour gérer le carrousel
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedChatroom, setSelectedChatroom] = useState(null); // State to hold selected chatroom data

  // Vérification de l'authentification utilisateur
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');

    if (!userId || !userName) {
      navigate('/login');
    }
  }, [navigate]);

  // Récupération des chatrooms pour l'utilisateur connecté
  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const userId = localStorage.getItem('userId'); // ID de l'utilisateur connecté
        const response = await fetch(`http://localhost:8080/api/chatrooms/admin/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setChatrooms(data); // Mettre à jour les chatrooms
        } else {
          console.error('Erreur lors de la récupération des chatrooms administrées');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des chatrooms :', error);
      }
    };
  
    fetchChatrooms();
  }, []);
  

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };


  const handleNext = () => {
    if (currentIndex < chatrooms.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const openEditModal = (chatroom) => {
    setSelectedChatroom({
      ...chatroom,
      authorizedUsers: chatroom.authorizedUsers || [],
      askedUsers: chatroom.askingUsers || [],
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };
  

  const handleRemoveUser = async (userId) => {
    try {
      await fetch(`http://localhost:8080/api/chatrooms/${selectedChatroom.id}/quitter/${userId}`, {
        method: 'PUT',
      });
      setSelectedChatroom((prev) => ({
        ...prev,
        authorizedUsers: prev.authorizedUsers.filter((user) => user.id !== userId),
      }));
    } catch (error) {
      console.error('Error removing user:', error);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await fetch(`http://localhost:8080/api/chatrooms/${selectedChatroom.id}/approve/${userId}`, {
        method: 'PUT',
      });
      setSelectedChatroom((prev) => ({
        ...prev,
        authorizedUsers: [...prev.authorizedUsers, prev.askedUsers.find((user) => user.id === userId)],
        askedUsers: prev.askedUsers.filter((user) => user.id !== userId),
      }));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleChatroomClick = (chatroomId) => {
    localStorage.setItem('chatroomId', chatroomId);
    navigate(`/chat`);
  };
  

  return (
    <ProfilContainer>
      <GlobalStyle />
      <Navbar>
      <Title onClick={() => navigate('/chat')}>Chat Application</Title>
      <NavbarItem>
          <Icon className="fas fa-bell" title="Notifications"></Icon>
          <Icon className="fas fa-user" title="Profil"></Icon>
        </NavbarItem>
      </Navbar>
      <Sidebar>
          <SidebarButton onClick={() => navigate('/profil')}>Chatrooms</SidebarButton>
          <SidebarButton onClick={() => navigate('/chats')}>Other Chats</SidebarButton>

      </Sidebar>

      <HeaderTitle>My Chatrooms</HeaderTitle>

      <ChatroomContainerWrapper>
          <PreviousButton onClick={handlePrevious} disabled={currentIndex === 0}>
            &#8249;
          </PreviousButton>
          <ChatroomContainer>
            {chatrooms.slice(currentIndex, currentIndex + 3).map((chatroom, index) => {
              const randomImage = Math.floor(Math.random() * 5) + 1; // Random image from 1 to 5
              return (
                <ChatroomItem key={index}>
                  <EditIcon src="/img/edit.png" onClick={() => openEditModal(chatroom)} />
                  <ChatroomImage src={`/img/${randomImage}.jpg`} alt="Chatroom" />
                  <h3>{chatroom.name}</h3>
                  <p>{chatroom.description}</p> {/* Description for each chatroom */}
                </ChatroomItem>
              );
            })}
          </ChatroomContainer>
          <NextButton onClick={handleNext} disabled={currentIndex >= chatrooms.length - 3}>
            &#8250;
          </NextButton>
          
        </ChatroomContainerWrapper>


        <StyledModal isOpen={isEditModalOpen} onRequestClose={closeEditModal}>
          <ModalContentWrapper>

            <ModalHeader>Edit Chat</ModalHeader>
            <Input
              type="text"
              placeholder="Chatroom Name"
              value={selectedChatroom?.name || ''}
            />

            <h4>Authorized Users</h4>
            <StyledTable>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedChatroom?.authorizedUsers?.map((user) => (
                <tr key={user.id}>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>
                    {/* Bouton avec icône sans fond */}
                    <button 
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                      onClick={() => handleRemoveUser(user.id)}>
                      <img src="/img/x.png" alt="Remove" style={{ width: '20px', height: '20px' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>

          <div>
            <h4>Asked Users</h4>
            <StyledTable>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedChatroom?.askedUsers?.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nom}</td>
                    <td>{user.prenom}</td>
                    <td>
                      {/* Bouton avec icône sans fond */}
                      <button 
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                          onClick={() => handleApproveUser(user.id)}>
                        <img src="/img/approve.png" alt="Approve" style={{ width: '26px', height: '26px' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </div>

          </ModalContentWrapper>
            <CloseButton onClick={closeEditModal}>Close</CloseButton>
        </StyledModal>
      <Footer>
      &copy; Todos los derechos reservados: Chatroom Zahrae 2024 <i className="fas fa-cat"></i>
      </Footer>
    </ProfilContainer>
  );
};

export default MyChats;
