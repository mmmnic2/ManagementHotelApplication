import { jwtDecode } from "jwt-decode";
import { createContext, useState, useContext } from "react";

import PropTypes from "prop-types";

export const AuthContext = createContext({
  user: null,
  handleLogin: (token) => {},
  handleLogout: () => {},
});
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const handleLogin = (token) => {
    const decodedToken = jwtDecode(token);
    localStorage.setItem("userId", decodedToken.sub);
    localStorage.setItem("userRole", decodedToken.roles);
    localStorage.setItem("token", token);
    localStorage.setItem("id", decodedToken.userId);
    setUser(decodedToken);
  };
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user: user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.any,
};

export const useAuth = () => {
  return useContext(AuthContext);
};
