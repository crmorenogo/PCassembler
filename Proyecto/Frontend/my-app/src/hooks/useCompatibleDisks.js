import { useState, useEffect } from 'react';

export const useCompatibleDisks = (motherboardId, cpuId, gpuId, ramId) => {
  const [disks, setDisks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompatibleDisks = async () => {
    if (!motherboardId || !cpuId || !gpuId || !ramId) {
      setDisks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/get-compatible-disks', {
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
        throw new Error('Error al obtener discos duros compatibles');
      }

      const data = await response.json();
      
      // Verificar la estructura correcta de la respuesta
      if (data && Array.isArray(data.compatibleDisks)) {
        setDisks(data.compatibleDisks);
      } else if (Array.isArray(data)) {
        setDisks(data);
      } else {
        console.error('Formato de respuesta inesperado:', data);
        setDisks([]);
      }
    } catch (err) {
      setError(err.message);
      setDisks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompatibleDisks();
  }, [motherboardId, cpuId, gpuId, ramId]);

  const refetch = () => {
    fetchCompatibleDisks();
  };

  return {
    disks,
    loading,
    error,
    refetch
  };
}; 