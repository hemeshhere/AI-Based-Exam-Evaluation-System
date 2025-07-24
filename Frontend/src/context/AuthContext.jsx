import { createContext, useEffect, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken, getToken, removeToken, decodeToken, isTokenExpired } from "../utils/handleToken.js";
import { login as apiLogin } from "../services/apiServices.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check token and set user on mount
  useEffect(() => {
    const { accessToken } = getToken();
    if (accessToken && !isTokenExpired(accessToken)) {
      const decoded = decodeToken(accessToken);
      setUser(decoded);
    } else {
      setUser(null);
      removeToken();
    }
    setAuthLoading(false);
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    setAuthLoading(true);
    try {
      const data = await apiLogin(credentials);
      setToken(data);
      const decoded = decodeToken(data.accessToken);
      setUser(decoded);
      navigate("/");
      return true;
    } catch (err) {
      setUser(null);
      removeToken();
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, [navigate]);

  // Logout function
  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  // Check if user is authenticated
  const checkAuth = useCallback(() => {
    const { accessToken } = getToken();
    if (accessToken && !isTokenExpired(accessToken)) {
      setUser(decodeToken(accessToken));
      return true;
    }
    setUser(null);
    removeToken();
    return false;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      authLoading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};