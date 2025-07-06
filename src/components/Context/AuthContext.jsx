import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    loginInfo: {},
    tokens: {},
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
    const tokens = JSON.parse(localStorage.getItem("tokens"));

    if (loginInfo && tokens) {
      setAuth({
        loginInfo,
        tokens,
        isLoading: false,
        isAuthenticated: true,
      });
    } else {
      setAuth((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = (loginInfo, tokens) => {
    setAuth({
      loginInfo,
      tokens,
      isAuthenticated: true,
      isLoading: false,
    });
    localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
    localStorage.setItem("tokens", JSON.stringify(tokens));
  };

  const logout = () => {
    setAuth({
      loginInfo: {},
      tokens: {},
      isLoading: false,
      isAuthenticated: false,
    });
    localStorage.removeItem("loginInfo");
    localStorage.removeItem("tokens");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
