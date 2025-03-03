/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
//Hola
const prisma = new PrismaClient();

// Obtener la ruta del archivo JSON de manera relativa
const jsonPath = path.join(process.cwd(), 'data', 'CASE_Update.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Ruta de la imagen por defecto
const DEFAULT_IMAGE = path.join(process.cwd(), 'public', 'CASE_images', 'default.jpg');

async function insertComponents() {
  try {
    for (const item of jsonData) {
      const imagenPath = item.image
        ? path.join(process.cwd(), 'public', item.image)
        : DEFAULT_IMAGE;

      await prisma.componente.create({
        data: {
          nombre: item.name,
          categoria: item.category,
          precio: item.prices?.lowestPrice || 0,
          marca: item.specifications.Manufacturer || 'Desconocido',
          especificaciones: item.specifications,
          url: item.url,
          lowestPrice: item.prices?.lowestPrice || 0,
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
