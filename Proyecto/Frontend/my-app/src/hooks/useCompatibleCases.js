import { useState, useEffect } from 'react';

export const useCompatibleCases = (motherboardId, cpuId, gpuId, ramId, storageId, psuId) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompatibleCases = async () => {
    if (!motherboardId || !cpuId || !gpuId || !ramId || !storageId || !psuId) {
      setCases([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/get-compatible-cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          motherboardId,
          cpuId,
          gpuId,
          ramId,
          storageId,
          psuId
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener gabinetes compatibles');
      }

      const data = await response.json();
      
      // Verificar la estructura correcta de la respuesta
      if (data && Array.isArray(data.compatibleCases)) {
        setCases(data.compatibleCases);
      } else if (Array.isArray(data)) {
        setCases(data);
      } else {
        console.error('Formato de respuesta inesperado:', data);
        setCases([]);
      }
    } catch (err) {
      setError(err.message);
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompatibleCases();
  }, [motherboardId, cpuId, gpuId, ramId, storageId, psuId]);

  const refetch = () => {
    fetchCompatibleCases();
  };

  return {
    cases,
    loading,
    error,
    refetch
  };
}; 