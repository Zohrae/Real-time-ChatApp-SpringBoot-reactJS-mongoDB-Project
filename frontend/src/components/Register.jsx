import React, { useState } from 'react';
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgb(253, 255, 255); /* Light blue background */
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  max-width: 650px;
  width: 650px;
  padding: 40px;
`;

const RegisterWraper = styled.div`
  flex: 1;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 25px;
  color: black; /* Deep blue for title */
  font-size: 3rem;
  font-family: 'Brush Script MT', cursive;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
`;

const Input = styled.input`
  padding: 15px 15px 15px 45px;
  font-size: 1.1rem;
  border: 1px solid #a3c2e7; /* Light blue border */
  border-radius: 10px;
  outline: none;
  width: calc(50% - 10px); /* Adjust for spacing */
  background-color: rgb(220, 229, 248); /* Subtle blue background */
  transition: border 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #6580b8; /* Stronger blue on focus */
    box-shadow: 0 0 6px rgba(101, 128, 184, 0.6);
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

const Register = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    login: '',
    mdp: '',
    confirmMdp: '',
  });

  const [error, setError] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newUser.mdp !== newUser.confirmMdp) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    fetch('http://localhost:8080/api/utilisateurs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setNewUser({
          nom: '',
          prenom: '',
          email: '',
          login: '',
          mdp: '',
          confirmMdp: '',
        });
        navigate('/login'); // Redirige l'utilisateur après l'inscription si nécessaire
      })
      .catch((error) =>
        console.error("Erreur lors de l'ajout de l'utilisateur:", error)
      );
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <RegisterWraper>
          <Title>Inscription</Title>
          <Form onSubmit={handleFormSubmit}>
            <InputWrapper>
              <Input
                type="text"
                placeholder="Nom"
                value={newUser.nom}
                onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Prénom"
                value={newUser.prenom}
                onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
              />
            </InputWrapper>
            <InputWrapper>
              <Input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <Input
                type="text"
                placeholder="Login"
                value={newUser.login}
                onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
              />
            </InputWrapper>
            <InputWrapper>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={newUser.mdp}
                onChange={(e) => setNewUser({ ...newUser, mdp: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Confirmez le mot de passe"
                value={newUser.confirmMdp}
                onChange={(e) => setNewUser({ ...newUser, confirmMdp: e.target.value })}
              />
            </InputWrapper>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <Button type="submit">S'inscrire</Button>
          </Form>
        </RegisterWraper>
      </Container>
    </>
  );
};

export default Register;
