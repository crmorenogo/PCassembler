import { useState, useEffect } from 'react';

export const useCompatiblePSU = (motherboardId, cpuId, gpuId, ramId) => {
  const [psus, setPsus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompatiblePSUs = async () => {
    if (!motherboardId || !cpuId || !gpuId || !ramId) {
      setPsus([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/get-compatible-psus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          motherboardId: motherboardId,
          cpuId: cpuId,
          gpuId: gpuId,
          ramId: ramId
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener fuentes de poder compatibles');
      }

      const data = await response.json();
      
      // Verificar la estructura correcta de la respuesta
      if (data && Array.isArray(data.psusCompatibles)) {
        setPsus(data.psusCompatibles);
      } else if (Array.isArray(data)) {
        setPsus(data);
      } else {
        console.error('Formato de respuesta inesperado:', data);
        setPsus([]);
      }
    } catch (err) {
      setError(err.message);
      setPsus([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompatiblePSUs();
  }, [motherboardId, cpuId, gpuId, ramId]); // Se ejecutará cada vez que cambie alguno de los IDs

  const refetch = () => {
    fetchCompatiblePSUs();
  };

  return {
    psus,
    loading,
    error,
    refetch
  };
}; 