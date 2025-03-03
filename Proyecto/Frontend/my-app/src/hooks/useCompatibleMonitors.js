import { useState, useEffect } from 'react';

export const useCompatibleMonitors = (motherboardId, cpuId, gpuId, ramId, storageId, psuId, caseId) => {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompatibleMonitors = async () => {
    if (!motherboardId || !cpuId || !gpuId || !ramId || !storageId || !psuId || !caseId) {
      setMonitors([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3001/api/get-compatible-monitors', {
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
          psuId,
          caseId
        }),
      });

      if (!response.ok) {
        throw new Error('Error al obtener monitores compatibles');
      }

      const data = await response.json();
      
      // Verificar la estructura correcta de la respuesta
      if (data && Array.isArray(data.compatibleMonitors)) {
        setMonitors(data.compatibleMonitors);
      } else if (Array.isArray(data)) {
        setMonitors(data);
      } else {
        console.error('Formato de respuesta inesperado:', data);
        setMonitors([]);
      }
    } catch (err) {
      setError(err.message);
      setMonitors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompatibleMonitors();
  }, [motherboardId, cpuId, gpuId, ramId, storageId, psuId, caseId]);

  const refetch = () => {
    fetchCompatibleMonitors();
  };

  return {
    monitors,
    loading,
    error,
    refetch
  };
}; 