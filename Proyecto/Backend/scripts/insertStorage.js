/* eslint-disable no-undef */
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
//Hola
const prisma = new PrismaClient();

// Obtener la ruta del archivo JSON de manera relativa
const jsonPath = path.join(process.cwd(), 'data', 'STORAGE_Update.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Ruta de la imagen por defecto
const DEFAULT_IMAGE = path.join(process.cwd(), 'public', 'STORAGE_images', 'default.jpg');

async function insertComponents() {
  try {
    for (const item of jsonData) {
      const imagenPath = item.image
        ? path.join(process.cwd(), 'public', item.image)
        : DEFAULT_IMAGE;

      // Verificar y asignar valores predeterminados a las propiedades necesarias
      const nombre = item.name || 'Nombre desconocido';
      const categoria = item.category || 'Categoría desconocida';
      const precio = item.prices?.lowestPrice ?? 0;
      const marca = item.specifications?.Manufacturer || 'Desconocido';
      const especificaciones = item.specifications ?? {};
      const url = item.url || '';
      const lowestPrice = item.prices?.lowestPrice ?? 0;
      const averageRating = item.ratings?.averageRating ?? null;

      try {
        await prisma.componente.create({
          data: {
            nombre,
            categoria,
            precio,
            marca,
            especificaciones,
            url,
            lowestPrice,
            averageRating,
            imagenUrl: imagenPath,
          },
        });
        console.log(`✅ ${nombre} insertado correctamente`);
      } catch (innerError) {
        console.error(`❌ Error al insertar ${nombre}:`, innerError);
      }
    }
  } catch (error) {
    console.error('❌ Error en el proceso de inserción de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

insertComponents();
