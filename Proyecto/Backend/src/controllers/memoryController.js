import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
//Obtener RAMs compatibles con una motherboard(Recive el ID de la Moterboard)
export const getMemoryCompatibles = async (req, res) => {
  try {
    const { motherboardId, cpuId, gpuId } = req.body;

    // Validar los IDs de la motherboard, la CPU, y la GPU
    if (
      !motherboardId ||
      typeof motherboardId !== "number" ||
      !cpuId ||
      typeof cpuId !== "number" ||
      !gpuId ||
      typeof gpuId !== "number"
    ) {
      return res
        .status(400)
        .json({ message: "❌ IDs de motherboard, CPU y GPU no válidos" });
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

    // Extraer las especificaciones de la motherboard relacionadas con la memoria
    const memoryType = motherboard.especificaciones?.["Memory Type"];
    const memoryMax = parseInt(
      motherboard.especificaciones?.["Memory Max"].replace(" GB", "")
    );
    const memorySpeeds = motherboard.especificaciones?.["Memory Speed"];

    console.log("Memory Type:", memoryType);
    console.log("Memory Max:", memoryMax);
    console.log("Memory Speeds:", memorySpeeds);

    // Buscar memorias RAM compatibles
    const memoryCompatibles = await prisma.componente.findMany({
      where: {
        categoria: "Memory",
        especificaciones: {
          path: ["Form Factor"],
          equals: `288-pin DIMM (${memoryType})`, // Buscar memorias con el mismo formato y tipo
        },
      },
      select: {
        id_componente: true,
        nombre: true,
        marca: true,
        precio: true,
        averageRating: true,
        imagenUrl: true,
        especificaciones: true,
         // Incluye detalles como velocidad, capacidad, tipo de memoria, etc.
      },
    });

    console.log(
      "Memorias RAM Compatibles antes del filtrado:",
      memoryCompatibles
    );

    // Filtrar memorias RAM basadas en las especificaciones de la motherboard
    const evaluatedMemory = memoryCompatibles.filter((mem) => {
      const memSpeed = mem.especificaciones?.["Speed"];
      const memModules = mem.especificaciones?.["Modules"];
      const memTotalCapacity = memModules
        .split(" x ")
        .reduce((acc, value) => acc * parseInt(value), 1); // Calcula la capacidad total

      // Verificar compatibilidad de velocidad y capacidad
      return memTotalCapacity <= memoryMax && memorySpeeds.includes(memSpeed);
    });

    console.log(
      "Memorias RAM Compatibles después del filtrado:",
      evaluatedMemory
    );

    res.json({ memoryCompatibles: evaluatedMemory });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "❌ Error al obtener memorias RAM compatibles",
      error: error.message,
    });
  }
};
