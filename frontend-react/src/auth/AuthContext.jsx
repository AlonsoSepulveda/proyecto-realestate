// src/auth/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     const savedToken = localStorage.getItem("token");
  //     if (!savedToken) return;

  //     setToken(savedToken);

  //     try {
  //       await fetchUser(); // si falla, hace logout
  //     } catch (error) {
  //       console.error("Fallo al cargar usuario en inicio:", error);
  //     }
  //   };

  //   initializeAuth(); // solo una vez
  // }, []);

  // const fetchUser = async () => {
  //   try {
  //     const res = await api.get("/me");
  //     setUser(res.data);
  //   } catch (error) {
  //     const status = error.response?.status;

  //     if (status === 401 || status === 403) {
  //       console.warn("Token inválido o expirado. Cerrando sesión...");
  //       logout();
  //     } else {
  //       console.error("Error inesperado al obtener usuario:", error);
  //     }
  //   }
  // };

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
