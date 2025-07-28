import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login";
import TodoList from "./todo";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/todo" replace /> : <Login onLogin={() => setIsLoggedIn(true)} />
          }
        />
        <Route
          path="/todo"
          element={isLoggedIn ? <TodoList onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}
