"use client";

import React, { useEffect, useState, useRef } from "react";
import { getTestMessage } from "../services/api";

const BackendMessage = () => {
  const [message, setMessage] = useState("");
  const hasFetched = useRef(false); // Ref para evitar múltiples peticiones

  useEffect(() => {
    console.log("useEffect running..."); // Debugging message
    if (!hasFetched.current) {
      hasFetched.current = true;
      getTestMessage()
        .then((data) => {
          console.log("Fetched Data:", data);
          setMessage(data);
        })
        .catch((error) => console.error("Error fetching message:", error));
    }
  }, []);

  return <p>{message || "Cargando..."}</p>;
};

export default BackendMessage;
