import { useState, useEffect } from 'react';

export const useBoards = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3001/api/boards');
      
      if (!response.ok) {
        throw new Error('Error al obtener las placas base');
      }

      const data = await response.json();
      setBoards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const refetch = () => {
    fetchBoards();
  };

  return {
    boards,
    loading,
    error,
    refetch
  };
}; 