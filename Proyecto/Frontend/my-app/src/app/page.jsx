"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const buildOptions = [
    {
      title: "PC Gaming",
      description: "Configura tu PC gaming de alto rendimiento con los mejores componentes.",
      image: "/builds/gaming-pc.png",
      link: "/armar-pc?type=gaming"
    },
    {
      title: "PC Workstation",
      description: "Estaciones de trabajo profesionales para diseño y desarrollo.",
      image: "/builds/workstation-pc.png",
      link: "/armar-pc?type=workstation"
    },
    {
      title: "PC Streaming",
      description: "Configuraciones optimizadas para streaming y creación de contenido.",
      image: "/builds/streaming-pc.png",
      link: "/armar-pc?type=streaming"
    },
    {
      title: "PC Básica",
      description: "Computadoras confiables para uso diario y oficina.",
      image: "/builds/basica-pc.png",
      link: "/armar-pc?type=basic"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black text-gray-900 dark:text-white">
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(calc(50% - 10px));
          }
          50% {
            transform: translateY(calc(50% + 10px));
          }
          100% {
            transform: translateY(calc(50% - 10px));
          }
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative pt-20 md:pt-28 md:h-screen">
        {/* PC Image Showcase  mobile*/}
        <div className="flex justify-center items-center md:hidden z-0  w-full h-[70vh]">
          <Image
            src="/home.png"
            alt="Custom PC Build"
            width={500}
            height={500}
            className="w-[400px]"
            priority
          />
        </div>
        
        {/* Contenido del Hero */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full z-10">
          <div className="flex flex-col justify-center h-full">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500">
              BUILD YOUR PC
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
              Diseña tu PC perfecta con nuestro configurador inteligente. 
              Selecciona los mejores componentes y crea la máquina de tus sueños.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/armar-pc"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 rounded-lg font-semibold text-white hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-500/20 dark:shadow-purple-500/30"
              >
                Comenzar a Construir
              </Link>
              <Link
                href="/productos"
                className="px-8 py-4 bg-white dark:bg-gray-800 rounded-lg font-semibold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                Ver Componentes
              </Link>
            </div>
          </div>
        </div>

        {/* PC Image Showcase  web*/}
        <div className="relative hidden md:block z-0 right-0 bottom-1/2 w-full md:w-1/2 h-[500px] animate-[float_5s_ease-in-out_infinite] md:absolute">
          <Image
            src="/home.png"
            alt="Custom PC Build"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Build Options Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-white">
          Elige tu <span className="text-purple-600 dark:text-purple-500">Configuración Ideal</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {buildOptions.map((option, index) => (
            <Link 
              href={option.link}
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg shadow-gray-200/50 dark:shadow-none"
            >
              <div className="h-48 relative mb-4">
                <Image
                  src={option.image}
                  alt={option.title}
                  fill
                  className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-60"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">
                {option.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {option.description}
              </p>
              {/* Efecto de borde brillante en hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/30 rounded-2xl transition-all duration-300"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Garantía Asegurada</h3>
              <p className="text-gray-600 dark:text-gray-400">Todos nuestros componentes cuentan con garantía oficial del fabricante.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Máximo Rendimiento</h3>
              <p className="text-gray-600 dark:text-gray-400">Optimizamos cada configuración para obtener el mejor desempeño.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Soporte 24/7</h3>
              <p className="text-gray-600 dark:text-gray-400">Equipo técnico disponible para ayudarte en cualquier momento.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}