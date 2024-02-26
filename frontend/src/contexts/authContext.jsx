import { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AuthContext = createContext({});
const serverUrl = process.env.REACT_APP_SERVER_URL;

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false,
  );
  const [username, setUsername] = useState(() =>
    localStorage.getItem("username"),
  );
  const navigate = useNavigate();
  const { t } = useTranslation();

  const login = async (values) => {
    try {
      const result = await axios.post(`${serverUrl}/api/v1/login`, values);
      const token = result.data.token;
      setUsername(result.data.username);

      localStorage.setItem("token", token);
      localStorage.setItem("username", result.data.username);

      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error(t("loginForm.validationLogin.error"));
      }
      if (error.code === "ERR_NETWORK") {
        toast.error(t("loginForm.validationLogin.network"));
      }
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
    navigate("/login");
  };

  const setToken = (data) => {
    setUsername(data.username);
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);

    setIsAuthenticated(true);
  };

  return (
    <>
      <AuthContext.Provider
        value={{ isAuthenticated, login, logout, username, setToken }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
