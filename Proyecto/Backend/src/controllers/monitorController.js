import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getCompatibleMonitors = async (req, res) => {
  try {
    const { motherboardId, cpuId, gpuId, ramId, storageId, supplyId, caseId } =
      req.body;
    console.log("🔍 IDs recibidos:", {
      motherboardId,
      cpuId,
      gpuId,
      ramId,
      storageId,
      supplyId,
      caseId,
    });

    // Validar que al menos se haya enviado una GPU
    if (!gpuId) {
      return res
        .status(400)
        .json({
          error: "gpuId es requerido para buscar monitores compatibles",
        });
    }

    // Verificar que los componentes existen en la base de datos
    const componentIds = {
      motherboardId,
      cpuId,
      gpuId,
      ramId,
      storageId,
      supplyId,
      caseId,
    };
    const validComponents = {};

    for (const [key, id] of Object.entries(componentIds)) {
      if (id) {
        const component = await prisma.componente.findUnique({
          where: { id_componente: Number(id) },
          select: { id_componente: true },
        });

        if (!component) {
          return res
            .status(404)
            .json({ error: `${key} con ID ${id} no encontrado` });
        }

        validComponents[key] = component;
      }
    }

    console.log("✅ Todos los componentes son válidos:", validComponents);

    // Obtener especificaciones de la GPU
    const gpu = await prisma.componente.findUnique({
      where: { id_componente: Number(gpuId) },
      select: { especificaciones: true },
    });

    if (!gpu) {
      return res.status(404).json({ error: "GPU no encontrada" });
    }

    console.log("🖥️ Especificaciones de la GPU:", gpu.especificaciones);

    // Extraer y normalizar el Frame Sync de la GPU
    let gpuFrameSync = gpu.especificaciones?.["Frame Sync"];

    if (!gpuFrameSync) {
      return res
        .status(400)
        .json({ error: "La GPU no tiene tecnología de sincronización" });
    }

    let gpuFrameSyncArray = Array.isArray(gpuFrameSync)
      ? gpuFrameSync
      : [gpuFrameSync];

    console.log("🔄 Tecnologías Frame Sync de la GPU:", gpuFrameSyncArray);

    // Mapeo de tecnologías equivalentes
    const frameSyncEquivalents = {
      FreeSync: ["FreeSync", "FreeSync Premium", "FreeSync Premium Pro"],
      "G-Sync": ["G-Sync", "G-Sync Compatible"],
    };

    // Construir lista de compatibilidad
    let frameSyncConditions = new Set();

    gpuFrameSyncArray.forEach((sync) => {
      frameSyncConditions.add(sync);
      if (frameSyncEquivalents[sync]) {
        frameSyncEquivalents[sync].forEach((eq) => frameSyncConditions.add(eq));
      }
    });

    console.log(
      "🔎 Buscando monitores con compatibilidad:",
      frameSyncConditions
    );

    // Construcción de la consulta para Prisma
    const conditions = Array.from(frameSyncConditions).map((sync) => ({
      OR: [
        { especificaciones: { path: ["Frame Sync"], string_contains: sync } },
        { especificaciones: { path: ["Frame Sync"], array_contains: sync } },
      ],
    }));

    // Buscar monitores compatibles
    const compatibleMonitors = await prisma.componente.findMany({
      where: {
        categoria: "Monitor",
        AND: conditions.length > 0 ? [{ OR: conditions }] : [],
      },
    });

    console.log(
      "✅ Monitores compatibles encontrados:",
      compatibleMonitors.length
    );
    return res.json(compatibleMonitors);
  } catch (error) {
    console.error("❌ Error en getCompatibleMonitors:", error);
    return res
      .status(500)
      .json({ error: "Error al obtener monitores compatibles" });
  }
};
