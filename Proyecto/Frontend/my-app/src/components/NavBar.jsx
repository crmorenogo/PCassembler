"use client";
import React, { useState } from 'react';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <h1 className='text-3xl font-bold text-center bg-red-500'>Hola</h1>
  );
};

export default NavBar;