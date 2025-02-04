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
    font-family: 'Arial', sans-serif;
    background-color: #f9f5ff; /* Very light purple */
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column; /* Removed side-by-side layout */
  align-items: center;
  justify-content: center;
  background-color: rgb(253, 255, 255); /* Light blue background */
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px; /* Reduced width to fit form only */
  width: 400px;
  padding: 40px; /* Added padding for better spacing */
`;

const LoginWrapper = styled.div`
  flex: 1;
  text-align: center;
`;


const Title = styled.h2`
  margin-bottom: 25px;
  color: black; /* Deep blue for title */
  font-size: 3rem;
  font-family: 'Brush Script MT', cursive;
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  margin-bottom: 20px;
  font-size: 0.95rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  padding: 15px 15px 15px 45px;
  font-size: 1.1rem;
  border: 1px solid #a3c2e7; /* Light blue border */
  border-radius: 10px;
  outline: none;
  width: 100%;
  background-color: rgb(220, 229, 248); /* Subtle blue background */
  transition: border 0.3s ease, box-shadow 0.3s ease;
  
  &:focus {
    border-color: #6580b8; /* Stronger blue on focus */
    box-shadow: 0 0 6px rgba(101, 128, 184, 0.6);
  }
`;

const Select = styled.select`
  padding: 15px 15px;
  font-size: 1.1rem;
  border: 1px solid #a3c2e7; /* Light blue border */
  border-radius: 10px;
  outline: none;
  width: 100%;
  background-color: rgb(250, 250, 250); /* Subtle blue background */
  transition: border 0.3s ease, box-shadow 0.3s ease;
  color: #333; /* Text color */

  &:focus {
    border-color: #6580b8; /* Stronger blue on focus */
    box-shadow: 0 0 6px rgba(101, 128, 184, 0.6);
  }

  option {
    background-color: rgb(255, 255, 255); /* Same background as select */
    color: #333; /* Option text color */
    padding: 10px;
  }
`;


const Icon = styled.i`
  position: absolute;
  top: 54%;
  left: 15px;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: gray; /* Yellow matching with purple */
  img {
    width: 20px;
    height: 20px;
  }
`;

const Button = styled.button`
  padding: 5px;
  font-size: 2rem;
  font-family: 'Brush Script MT', cursive;
  color: #fff;
  background-color: #6580b8; /* Primary blue shade */
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #0d47a1; /* Dark blue hover */
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(13, 71, 161, 0.3);
  }

  &:active {
    background-color: #0a355e; /* Even darker blue on click */
    transform: scale(0.98);
  }
`;


const CreateAccountLink = styled.a`
  display: block;
  margin-top: 20px;
  color: #0d47a1; /* Blue link */
  text-decoration: none;
  font-size: 1.5rem;
  font-family: 'Brush Script MT', cursive;
  font-weight: bold;

`;

const Login = () => {
  const [loginData, setLoginData] = useState({
    login: '',
    mdp: '',
    chatroom: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [chatrooms, setChatrooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/chatrooms');
        if (response.ok) {
          const data = await response.json();
          setChatrooms(data);
        } else {
          console.error('Failed to fetch chatrooms');
        }
      } catch (error) {
        console.error('Error fetching chatrooms:', error);
      }
    };

    fetchChatrooms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find the selected chatroom
    const chatroom = chatrooms.find(cr => cr.id === loginData.chatroom);

    if (chatroom) {
      // Check if user is already authorized for the selected chatroom
      const isAuthorized = chatroom.authorizedUsers.some(user => user.login === loginData.login);

      if (!isAuthorized) {
        setErrorMessage('You are not authorized to access this chatroom.');
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData), // Includes chatroom
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('userName', data.userName);
        localStorage.setItem('userEmail', data.userEmail);
        localStorage.setItem('userRole', data.userRole);
        localStorage.setItem('chatroomId', loginData.chatroom);
        navigate('/chat');
      } else if (response.status === 401) {
        const errorText = await response.text(); // Récupérer le message du serveur
        setErrorMessage(errorText || 'Unauthorized access to chatroom.');
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
      <LoginWrapper>
          <Title>Connexion</Title>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Form onSubmit={handleSubmit}>
            <InputWrapper>
              <Icon>
                <img src="/img/user.png" alt="User Icon" />
              </Icon>              
              <Input
                type="text"
                name="login"
                placeholder="Username"
                value={loginData.login}
                onChange={handleInputChange}
                required
              />
            </InputWrapper>
            <InputWrapper>
            <Icon>
                <img src="/img/lock.png" alt="User Icon" />
              </Icon>
              <Input
                type="password"
                name="mdp"
                placeholder="Password"
                value={loginData.mdp}
                onChange={handleInputChange}
                required
              />
            </InputWrapper>
            {/* <InputWrapper>
              <Select
                name="chatroom"
                value={loginData.chatroom}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Chatroom</option>
                {chatrooms.map(chatroom => (
                  <option key={chatroom.id} value={chatroom.id}>
                    {chatroom.name}
                  </option>
                ))}
              </Select>
            </InputWrapper> */}
            <Button type="submit">Login</Button>
          </Form>
          <CreateAccountLink href="/create-account">Create Account</CreateAccountLink>
        </LoginWrapper>
      </Container>
    </>
  );
};

export default Login;