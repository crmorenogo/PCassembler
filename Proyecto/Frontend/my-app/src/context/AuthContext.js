import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la aplicación
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 