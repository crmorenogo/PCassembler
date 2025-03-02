import { useState, useEffect } from 'react';

export const useCompatibleGPUs = (motherboardId, cpuId) => {
  const [gpus, setGpus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompatibleGPUs = async () => {
    if (!motherboardId || !cpuId) {
      setGpus([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/gpus-compatibles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          motherboardId: motherboardId,
          cpuId: cpuId
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener GPUs compatibles');
      }

      const data = await response.json();
      
      // Verificar la estructura correcta de la respuesta
      if (data && Array.isArray(data.gpusCompatibles)) {
        setGpus(data.gpusCompatibles);
      } else if (Array.isArray(data)) {
        setGpus(data);
      } else {
        console.error('Formato de respuesta inesperado:', data);
        setGpus([]);
      }
    } catch (err) {
      setError(err.message);
      setGpus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompatibleGPUs();
  }, [motherboardId, cpuId]); // Se ejecutará cada vez que cambie el motherboardId o cpuId

  const refetch = () => {
    fetchCompatibleGPUs();
  };

  return {
    gpus,
    loading,
    error,
    refetch
  };
}; 