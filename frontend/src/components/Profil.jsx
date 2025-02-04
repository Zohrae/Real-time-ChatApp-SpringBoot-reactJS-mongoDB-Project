import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

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






const Profil = () => {
  const navigate = useNavigate();
  const [isProfilModalOpen, setIsProfilModalOpen] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Index pour gérer le carrousel

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
        const userId = localStorage.getItem('userId'); // Récupérer l'utilisateur connecté
        const response = await fetch(`http://localhost:8080/api/chatrooms/for-user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setChatrooms(data); // Filtrer les chatrooms pour cet utilisateur
        } else {
          console.error('Erreur lors de la récupération des chatrooms autorisées');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des chatrooms:', error);
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

  // Gestion du modal
  const openProfilModal = () => setIsProfilModalOpen(true);
  const closeProfilModal = () => setIsProfilModalOpen(false);

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
          <Icon className="fas fa-user" title="Profil" onClick={openProfilModal}></Icon>
        </NavbarItem>
      </Navbar>
      <Sidebar>
          <SidebarButton onClick={() => navigate('/mychats')}>My Chats</SidebarButton>
          <SidebarButton onClick={() => navigate('/chats')}>Other Chats</SidebarButton>

      </Sidebar>

      <HeaderTitle>Available Chatrooms</HeaderTitle>

      <ChatroomContainerWrapper>
          <PreviousButton onClick={handlePrevious} disabled={currentIndex === 0}>
            &#8249;
          </PreviousButton>
          <ChatroomContainer>
            {chatrooms.slice(currentIndex, currentIndex + 3).map((chatroom, index) => {
              const randomImage = Math.floor(Math.random() * 5) + 1; // Random image from 1 to 5
              return (
                <ChatroomItem key={index} onClick={() => handleChatroomClick(chatroom.id)}>
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


        

      <Footer>
      &copy; Todos los derechos reservados: Chatroom Zahrae 2024 <i className="fas fa-cat"></i>
</Footer>
    </ProfilContainer>
  );
};

export default Profil;
