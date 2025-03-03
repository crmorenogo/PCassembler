import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la aplicación
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setUser({
          id: decoded.id_usuario,
          nombre: decoded.nombre,
          correo: decoded.correo,
          rol: decoded.rol
        });
      } catch (error) {
        console.error('Error decodificando el token:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    try {
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id_usuario,
        nombre: decoded.nombre,
        correo: decoded.correo,
        rol: decoded.rol
      });
    } catch (error) {
      console.error('Error decodificando el token:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 