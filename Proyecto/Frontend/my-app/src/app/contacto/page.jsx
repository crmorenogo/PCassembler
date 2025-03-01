"use client";
import React from 'react';
import Image from 'next/image';

export default function ContactoPage() {
  const teamMembers = [
    {
      name: "Sebastian Olarte",
      role: "Desarrollador backend",
      image: "default.png",
    },
    {
      name: "Cristian",
      role: "Desarrollador backend",
      image: "default.png",
    },
    {
      name: "Diego Rojas",
      role: "Desarrollador fullstack",
      image: "default.png",
    },
    {
      name: "Fuentes",
      role: "Desarrollador backend",
      image: "default.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <div className="w-full h-screen flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            ¿Necesitas ayuda? Estamos aquí para ti 24/7.
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
            Nuestro equipo de expertos está listo para ayudarte en cualquier momento.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-base font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Agendar llamada
            </button>
            <button className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Crear cuenta
            </button>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl min-h-[400px] flex justify-center items-center mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-start w-full overflow-x-auto gap-5 lg:justify-center">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="group min-w-[250px] h-[350px] relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg shadow-gray-200/50 dark:shadow-none"
            >
              <div className="h-48 relative mb-4">
                <Image
                  src={'/team/default.png'}
                  alt={member.name}
                  fill
                  className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-60"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">
                {member.name}
              </h3>
              <div className="text-sm text-black dark:text-purple-400 font-semibold mb-2">
                {member.role}
              </div>
              <p className="text-black dark:text-gray-400">
                {member.description}
              </p>
              {/* Efecto de borde brillante en hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/30 rounded-2xl transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 