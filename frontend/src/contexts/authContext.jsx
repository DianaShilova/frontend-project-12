import { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false,
  );
  const [username, setUsername] = useState(() =>
    localStorage.getItem("username"),
  );
  const navigate = useNavigate();

  const login = async (values) => {
    try {
      const result = await axios.post(
        "http://localhost:3000/api/v1/login",
        values,
      );
      const token = result.data.token;
      setUsername(result.data.username);

      localStorage.setItem("token", token);
      localStorage.setItem("username", result.data.username);

      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        throw new Error("Неправильный логин/пароль");
      }
      throw new Error(" Неизвестная ошибка");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
}
