// src/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await api.post("/login", { email, password });
      const token = response.data.access_token;

      setToken(token);
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      throw err;
    }
  };

const logout = () => {
  setToken(null);
  setUser(null);
  localStorage.removeItem("token");
  navigate("/");
};

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
