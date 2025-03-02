import { useState, useEffect } from 'react';

export const useCompatibleCPUs = (motherboardId) => {
  const [cpus, setCpus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompatibleCPUs = async () => {
    if (!motherboardId) {
      setCpus([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/cpus-compatibles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          motherboardId: motherboardId
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener CPUs compatibles');
      }

      const data = await response.json();
      
      // Verificar la estructura correcta de la respuesta
      if (data && Array.isArray(data.cpusCompatibles)) {
        setCpus(data.cpusCompatibles);
      } else if (Array.isArray(data)) {
        setCpus(data);
      } else {
        console.error('Formato de respuesta inesperado:', data);
        setCpus([]);
      }
    } catch (err) {
      setError(err.message);
      setCpus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompatibleCPUs();
  }, [motherboardId]); // Se ejecutará cada vez que cambie el motherboardId

  const refetch = () => {
    fetchCompatibleCPUs();
  };

  return {
    cpus,
    loading,
    error,
    refetch
  };
}; 