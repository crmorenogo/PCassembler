"use client";

import React, { useEffect, useState, useRef } from 'react';
import { getTestMessage } from '../services/api';

const BackendMessage = () => {
  const [message, setMessage] = useState('');
  const hasFetched = useRef(false); // Ref para evitar múltiples peticiones

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true; // Marcar como ejecutado
      console.log("Fetching data..."); // Verificar si se ejecuta más de una vez
      getTestMessage()
        .then((data) => setMessage(data))
        .catch((error) => console.error('Error al obtener el mensaje:', error));
    }
  }, []);

  return <p>{message || 'Cargando...'}</p>;
};

export default BackendMessage;
