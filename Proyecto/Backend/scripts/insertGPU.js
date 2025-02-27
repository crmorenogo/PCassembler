/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Obtener la ruta del archivo JSON de manera relativa
const jsonPath = path.join(process.cwd(), 'data', 'GPU.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Ruta de la imagen por defecto
const DEFAULT_IMAGE = path.join(process.cwd(), 'public', 'GPU_images', 'default.jpg');

async function insertComponents() {
  try {
    for (const item of jsonData) {
      // Extraer las ofertas de precios
      const offers = item.prices?.prices || [];

      // Calcular el precio promedio y el precio mínimo
      let total = offers.reduce((sum, offer) => sum + (offer.price || 0), 0);
      let averagePrice = offers.length > 0 ? total / offers.length : 0; // Si no hay ofertas, el promedio es 0
      let lowestPrice = offers.length > 0 ? Math.min(...offers.map(offer => offer.price || Infinity)) : 0;

      const imagenPath = item.image
        ? path.join(process.cwd(), 'public', item.image)
        : DEFAULT_IMAGE;

      await prisma.componente.create({
        data: {
          nombre: item.name,
          categoria: item.category,
          precio: averagePrice,  // Guardamos el promedio de precios
          marca: item.specifications?.Manufacturer || 'Desconocido',
          especificaciones: item.specifications,
          url: item.url,
          lowestPrice: lowestPrice,  // Guardamos el precio mínimo de las ofertas
          averageRating: item.ratings?.averageRating || null,
          imagenUrl: imagenPath,
        },
      });
    }
    console.log('✅ Datos insertados correctamente');
  } catch (error) {
    console.error('❌ Error al insertar datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertComponents();
