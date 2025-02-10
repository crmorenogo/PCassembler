// src/app/layout.js
"use client"; // Asegúrate de añadir esta línea al principio del archivo

import React from 'react';
import BackendMessage from '@/components/BackendMessage'; // Ajusta la ruta según tu estructura de proyecto

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <h1>PCAssembler</h1>
      <main>
          {children}
        </main>
        <BackendMessage />
        </body>
    </html>
  );
};

export default Layout;
