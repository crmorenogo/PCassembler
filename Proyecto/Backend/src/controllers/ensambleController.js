import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getMotherBoards = async (req, res) => {
  try {
    const motherboards = await prisma.componente.findMany({
      where: { categoria: "Motherboard" },
      select: {
        id_componente: true,
        nombre: true,
        precio: true,
        marca: true,
        averageRating: true,
        url: true,
        imagenUrl: true,
        especificaciones: true,
      },
    });

    // Manejo seguro del JSONB `especificaciones`
    const motherboardsWithDetails = motherboards.map((board) => ({
      id_componente: board.id_componente,
      nombre: board.nombre,
      precio: board.precio,
      marca: board.marca,
      averageRating: board.averageRating,
      url: board.url,
      imagenUrl: board.imagenUrl,
      chipset: board.especificaciones?.["Chipset"] || "N/A",
      memoryType: board.especificaciones?.["Memory Type"] || "N/A",
      memoryMax: board.especificaciones?.["Memory Max"] || "N/A",
      formFactor: board.especificaciones?.["Form Factor"] || "N/A",
      socketCPU: board.especificaciones?.["Socket / CPU"] || "N/A",
    }));

    res.json(motherboardsWithDetails);
  } catch (error) {
    console.error("Error en getMotherBoards:", error);
    res.status(500).json({ message: "Error al obtener Motherboards", error: error.message });
  }
};



// Obtener CPUs compatibles con una motherboard
export const getCPUsCompatibles = async (req, res) => {
  try {
    const { motherboardId } = req.body;

    // Validar el ID de la motherboard
    if (!motherboardId || typeof motherboardId !== 'number') {
      return res.status(400).json({ message: "❌ ID de motherboard no válido" });
    }

    // Obtener la motherboard y su socket
    const motherboard = await prisma.componente.findUnique({
      where: { id_componente: motherboardId },
      select: {
        categoria: true,
        especificaciones: true, // JSONB donde está el socket
      },
    });

    if (!motherboard) {
      return res.status(404).json({ message: "❌ Motherboard no encontrada" });
    }

    if (motherboard.categoria !== 'Motherboard') {
      return res.status(400).json({ message: "❌ El ID proporcionado no es de una motherboard" });
    }

    // Extraer el socket de la motherboard
    const socketCPU = motherboard.especificaciones?.["Socket / CPU"];

    if (!socketCPU) {
      return res.status(400).json({ message: "❌ La motherboard no tiene un socket definido" });
    }

    // Buscar CPUs compatibles usando `equals` con `path`
    const cpusCompatibles = await prisma.componente.findMany({
      where: {
        categoria: "CPU",
        especificaciones: {
          path: ["Socket"], // Ruta exacta dentro del JSONB
          equals: socketCPU, // Buscar CPUs con el mismo socket
        },
      },
      select: {
        id_componente: true,
        nombre: true,
        marca: true,
        precio: true,
        especificaciones: true, // Incluye detalles como núcleos, frecuencia, TDP, etc.
      },
    });

    res.json({ cpusCompatibles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Error al obtener CPUs compatibles", error: error.message });
  }
};