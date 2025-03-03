/* eslint-disable no-dupe-keys */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTopComponents = async (req, res) => {
  try {
    const categories = [
      "Motherboard",
      "CPU",
      "Video Card",
      "Memory",
      "Storage",
      "Power Supply",
      "Case",
      "Monitor",
    ];

    const results = await Promise.all(
      categories.map(async (category) => {
        return await prisma.componente.findFirst({
          where: {
            categoria: category,
            averageRating: { not: 0, not: null },
            precio: { not: 0 },
            imagenUrl: { not: "default.jpg" },
          },
          orderBy: [
            { averageRating: "desc" },
            { precio: "desc" }, // Ordenar por precio descendente
          ],
        });
      })
    );

    res.json(results);
  } catch (error) {
    console.error("Error al obtener los componentes", error);
    res.status(500).json({ error: "Error al obtener los componentes" });
  }
};
