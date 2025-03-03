import { useState, useEffect } from 'react';

export const useCompatibleMemory = (motherboardId, cpuId, gpuId) => {
  const [memory, setMemory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompatibleMemory = async () => {
    if (!motherboardId || !cpuId || !gpuId) {
      setMemory([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/get-memory-compatibles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          motherboardId: motherboardId,
          cpuId: cpuId,
          gpuId: gpuId
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener memoria RAM compatible');
      }

      const data = await response.json();
      
      // Verificar la estructura correcta de la respuesta
      if (data && Array.isArray(data.memoryCompatibles)) {
        setMemory(data.memoryCompatibles);
      } else if (Array.isArray(data)) {
        setMemory(data);
      } else {
        console.error('Formato de respuesta inesperado:', data);
        setMemory([]);
      }
    } catch (err) {
      setError(err.message);
      setMemory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompatibleMemory();
  }, [motherboardId, cpuId, gpuId]); // Se ejecutará cada vez que cambie alguno de los IDs

  const refetch = () => {
    fetchCompatibleMemory();
  };

  return {
    memory,
    loading,
    error,
    refetch
  };
}; 