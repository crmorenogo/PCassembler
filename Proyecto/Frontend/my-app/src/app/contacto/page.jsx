"use client";
import React from 'react';
import Image from 'next/image';

const ContactPage = () => {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
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

      {/* Team Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="relative group border border-black rounded-2xl"
            >
              <div className="relative w-full h-[300px] rounded-2xl overflow-hidden dark:bg-gray-800">
                <div className="absolute top-8 bottom-8 left-2 right-2">
                  <Image
                    src={'/team/default.png'}
                    alt={member.name}
                    fill
                    className="object-cover object-center rounded-xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    priority={index < 2}
                  />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Email */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Email</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">soporte@pcassembler.com</p>
            </div>

            {/* Teléfono */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Teléfono</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">+34 900 123 456</p>
            </div>

            {/* Ubicación */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Ubicación</h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">Madrid, España</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 