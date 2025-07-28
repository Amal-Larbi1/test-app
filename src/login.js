import React, { useState } from "react";
import axios from "axios";
import './styles.css';

const API_URL = "http://localhost:3000";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        onLogin();
      } else {
        setError("Token manquant dans la réponse.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError("Erreur serveur ou API non disponible.");
      }
    }
  };

  const styles = {
    container: {
      maxWidth: 400,
      margin: "2rem auto",
      padding: "1rem",
      border: "1px solid #555",
      backgroundColor: "#f8f9fa",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      marginBottom: "1rem",
    },
    button: {
      width: "100%",
      padding: "0.5rem",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: 4,
      cursor: "pointer",
    },
    error: {
      color: "red",
      marginTop: 10,
      fontSize: "0.9rem",
    },
  };

  return (
    <div style={styles.container}>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Se connecter
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}
