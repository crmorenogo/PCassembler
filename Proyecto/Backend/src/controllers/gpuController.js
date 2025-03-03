
//Obtener GPUs compatibles con una motherboard y una CPU(Recive el ID de la Moterboard y la CPU)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getGPUsCompatibles = async (req, res) => {
  try {
    const { motherboardId, cpuId } = req.body;

    // Validar los IDs de la motherboard y la CPU
    if (
      !motherboardId ||
      typeof motherboardId !== "number" ||
      !cpuId ||
      typeof cpuId !== "number"
    ) {
      return res
        .status(400)
        .json({ message: "❌ IDs de motherboard y CPU no válidos" });
    }

    // Obtener la motherboard y sus especificaciones
    const motherboard = await prisma.componente.findUnique({
      where: { id_componente: motherboardId },
      select: {
        categoria: true,
        especificaciones: true, // JSONB donde están las especificaciones
      },
    });

    if (!motherboard) {
      return res.status(404).json({ message: "❌ Motherboard no encontrada" });
    }

    if (motherboard.categoria !== "Motherboard") {
      return res
        .status(400)
        .json({ message: "❌ El ID proporcionado no es de una motherboard" });
    }

    // Obtener la CPU (esto puede ser útil para verificar otras compatibilidades futuras)
    const cpu = await prisma.componente.findUnique({
      where: { id_componente: cpuId },
      select: {
        categoria: true,
        especificaciones: true, // JSONB donde están las especificaciones de la CPU
      },
    });

    if (!cpu) {
      return res.status(404).json({ message: "❌ CPU no encontrada" });
    }

    if (cpu.categoria !== "CPU") {
      return res
        .status(400)
        .json({ message: "❌ El ID proporcionado no es de una CPU" });
    }

    // Extraer la ranura PCIe x16 de la motherboard
    const pcieX16Slots = motherboard.especificaciones?.["PCIe x16 Slots"];

    console.log("PCIe x16 Slots:", pcieX16Slots);

    if (!pcieX16Slots || pcieX16Slots === "0") {
      return res.status(400).json({
        message: "❌ La motherboard no tiene ranuras PCIe x16 disponibles",
      });
    }

    // Buscar GPUs compatibles usando la especificación de interfaz PCIe
    const gpusCompatibles = await prisma.componente.findMany({
      where: {
        categoria: "Video Card",
        especificaciones: {
          path: ["Interface"],
          equals: "PCIe x16", // Buscar GPUs con la misma interfaz PCIe
        },
      },
      select: {
        id_componente: true,
        nombre: true,
        marca: true,
        precio: true,
        averageRating: true,
        imagenUrl: true,
        especificaciones: true, // Incluye detalles como memoria, frecuencias, TDP, etc.
      },
    });

    console.log("GPUs Compatibles:", gpusCompatibles);

    res.json({ gpusCompatibles });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "❌ Error al obtener GPUs compatibles",
      error: error.message,
    });
  }
};
