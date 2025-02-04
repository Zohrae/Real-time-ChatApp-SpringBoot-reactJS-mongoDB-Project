// Start.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Conteneur qui centre le contenu
const StartContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  box-sizing: border-box;
`;

// Bouton stylisé
const StartButton = styled.button`
  padding: 15px 30px;
  font-size: 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

function Start() {
  const navigate = useNavigate();

  return (
    <StartContainer>
      <StartButton onClick={() => navigate('/chat')}>Start</StartButton>
    </StartContainer>
  );
}

export default Start;
