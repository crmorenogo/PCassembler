// Obtener CPUs compatibles con una motherboard recibe el ID de la motherboard
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getCPUsCompatibles = async (req, res) => {
  try {
    const { motherboardId } = req.body;

    // Validar el ID de la motherboard
    if (!motherboardId || typeof motherboardId !== "number") {
      return res
        .status(400)
        .json({ message: "❌ ID de motherboard no válido" });
    }

    // Obtener la motherboard y su socket y chipset
    const motherboard = await prisma.componente.findUnique({
      where: { id_componente: motherboardId },
      select: {
        categoria: true,
        especificaciones: true, // JSONB donde están el socket y el chipset
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

    // Extraer el socket y el chipset de la motherboard
    const socketCPU = motherboard.especificaciones?.["Socket / CPU"];
    const chipset = motherboard.especificaciones?.["Chipset"];

    console.log("Socket CPU:", socketCPU);
    console.log("Chipset:", chipset);

    if (!socketCPU) {
      return res
        .status(400)
        .json({ message: "❌ La motherboard no tiene un socket definido" });
    }

    if (!chipset) {
      return res
        .status(400)
        .json({ message: "❌ La motherboard no tiene un chipset definido" });
    }

    // Buscar los chipsets compatibles para el socket de la motherboard
    const chipsetsCompatibles =
      await prisma.compatibilidadSocketChipset.findMany({
        where: { socket: socketCPU },
        select: { chipset: true },
      });

    console.log("Chipsets Compatibles:", chipsetsCompatibles);

    if (chipsetsCompatibles.length === 0) {
      return res.status(400).json({
        message: "❌ No hay chipsets compatibles definidos para este socket",
      });
    }

    const chipsetsArray = chipsetsCompatibles.map((c) => c.chipset);

    console.log("Chipsets Array:", chipsetsArray);

    // Buscar CPUs compatibles usando el socket
    const cpusCompatibles = await prisma.componente.findMany({
      where: {
        categoria: "CPU",
        especificaciones: {
          path: ["Socket"],
          equals: socketCPU,
        },
      },
      select: {
        id_componente: true,
        nombre: true,
        marca: true,
        averageRating: true,
        imagenUrl: true,
        precio: true,
        especificaciones: true, // Incluye detalles como núcleos, frecuencia, TDP, etc.
      },
    });

    console.log("CPUs Compatibles antes del filtrado:", cpusCompatibles);

    // Filtrar CPUs compatibles basadas en la tabla de compatibilidad (socket y chipset)
    const cpusCompatiblesConChipset = cpusCompatibles.filter(() => {
      return chipsetsArray.includes(chipset);
    });

    console.log(
      "CPUs Compatibles después del filtrado:",
      cpusCompatiblesConChipset
    );

    res.json({ cpusCompatibles: cpusCompatiblesConChipset });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "❌ Error al obtener CPUs compatibles",
      error: error.message,
    });
  }
};
