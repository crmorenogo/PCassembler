"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductosPage() {
  // Datos de ejemplo para los productos destacados
  const featuredProducts = [
    {
      id: 1,
      name: "NVIDIA RTX 4090",
      description: "La tarjeta gráfica más potente para gaming y creación de contenido",
      price: "1,599.99",
      image: "https://images.unsplash.com/photo-1623126908029-58cb08a2b272?q=80&w=2070",
      category: "Tarjetas Gráficas",
      badge: "Más Vendido"
    },
    {
      id: 2,
      name: "AMD Ryzen 9 7950X",
      description: "Rendimiento extremo para gaming y multitarea",
      price: "699.99",
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=2070",
      category: "Procesadores",
      badge: "Nuevo"
    },
    {
      id: 3,
      name: "Bundle Gaming Premium",
      description: "Combo completo de componentes de alta gama para tu PC gaming definitiva",
      price: "2,999.99",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2070",
      category: "Bundles",
      badge: "Oferta Especial",
      fullWidth: true
    },
    {
      id: 4,
      name: "Monitor ASUS ROG Swift",
      description: "Monitor gaming 4K 144Hz con tecnología G-Sync",
      price: "899.99",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070",
      category: "Monitores",
      badge: "Premium"
    },
    {
      id: 5,
      name: "SSD Samsung 990 Pro",
      description: "Almacenamiento NVMe de última generación",
      price: "199.99",
      image: "https://images.unsplash.com/photo-1628557044797-f21a177c37ec?q=80&w=2070",
      category: "Almacenamiento",
      badge: "Recomendado"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <div className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Productos <span className="text-purple-600">Destacados</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Descubre nuestra selección de componentes premium para tu próximo proyecto
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid gap-8">
          {/* Primera fila - 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProducts.slice(0, 2).map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64">
                  {/* <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  /> */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                      {product.badge}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-2">
                    {product.category}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Segunda fila - 1 columna (ancho completo) */}
          {featuredProducts.slice(2, 3).map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="grid md:grid-cols-2">
                <div className="relative h-96 md:h-auto">
                  {/* <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  /> */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                      {product.badge}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-2">
                    {product.category}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Ver Oferta Especial
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Tercera fila - 2 columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProducts.slice(3).map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64">
                  {/* <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  /> */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                      {product.badge}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold mb-2">
                    {product.category}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 