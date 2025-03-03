import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Obtner motherboards sin parametros
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
    res
      .status(500)
      .json({ message: "Error al obtener Motherboards", error: error.message });
  }
};

// Obtener CPUs compatibles con una motherboard recibe el ID de la motherboard
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

//Obtener GPUs compatibles con una motherboard y una CPU(Recive el ID de la Moterboard y la CPU)
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

// Obtener discos compatibles con una motherboard (Recibe el ID de la Motherboard)
export const getDisksCompatibles = async (req, res) => {
  try {
    const { motherboardId, cpuId, gpuId, ramId } = req.body;

    // Validar que los IDs sean números
    if (
      !motherboardId ||
      typeof motherboardId !== "number" ||
      !cpuId ||
      typeof cpuId !== "number" ||
      !gpuId ||
      typeof gpuId !== "number" ||
      !ramId ||
      typeof ramId !== "number"
    ) {
      return res
        .status(400)
        .json({ message: "❌ IDs de motherboard, CPU, GPU y RAM no válidos" });
    }

    // Obtener la motherboard y sus especificaciones
    const motherboard = await prisma.componente.findUnique({
      where: { id_componente: motherboardId },
      select: {
        categoria: true,
        especificaciones: true,
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

    // Extraer los slots M.2 y SATA disponibles
    const m2SlotsRaw = motherboard.especificaciones?.["M.2 Slots"] || [];
    const sataSlots = motherboard.especificaciones?.["SATA 6.0 Gb/s"] || 0;

    // Convertir los slots M.2 en una lista de factores de forma permitidos (2242, 2260, 2280, etc.)
    const m2Slots = m2SlotsRaw.flatMap((slot) => slot.match(/\d{4}/g) || []);

    console.log("M.2 Slots compatibles:", m2Slots);
    console.log("SATA Slots disponibles:", sataSlots);

    // Obtener todos los discos de almacenamiento
    const allDisks = await prisma.componente.findMany({
      where: { categoria: "Storage" },
      select: {
        id_componente: true,
        nombre: true,
        marca: true,
        precio: true,
        especificaciones: true,
      },
    });

    console.log("Discos disponibles antes del filtrado:", allDisks.length);

    // Filtrar discos compatibles
    const compatibleDisks = allDisks.filter((disk) => {
      const diskFormFactor =
        disk.especificaciones?.["Form Factor"]?.replace(/\s+/g, "") || "";
      const diskInterface = disk.especificaciones?.["Interface"] || "";

      // Extraer el número del factor de forma (ej. "M.2 2280" -> "2280")
      const diskSizeMatch = diskFormFactor.match(/(\d{4})$/);
      const diskSize = diskSizeMatch ? diskSizeMatch[0] : null;

      // Verificar compatibilidad M.2
      const isM2Compatible = diskSize && m2Slots.includes(diskSize);
      const isPcieCompatible = diskInterface.includes("PCIe");
      const isNvmeCompatible = diskInterface.includes("NVMe");
      const isSataCompatible = sataSlots > 0 && diskInterface.includes("SATA");

      // Permitir discos M.2 con cualquier interfaz compatible
      const isFinalM2Compatible =
        isM2Compatible &&
        (isPcieCompatible || isNvmeCompatible || isSataCompatible);

      console.log("Disk:", disk.nombre);
      console.log(" - Form Factor:", diskFormFactor);
      console.log(" - Interface:", diskInterface);
      console.log(" - Extracted Size:", diskSize);
      console.log(" - isM2Compatible:", isM2Compatible);
      console.log(" - isFinalM2Compatible:", isFinalM2Compatible);
      console.log(" - isSataCompatible:", isSataCompatible);

      return isFinalM2Compatible || isSataCompatible;
    });

    console.log(
      "Discos compatibles después del filtrado:",
      compatibleDisks.length
    );

    res.json({ compatibleDisks });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "❌ Error al obtener discos compatibles",
      error: error.message,
    });
  }
};

//PSU compatibles con una motherboard, CPU, GPU y RAM
export const getCompatiblePSUs = async (req, res) => {
  try {
    const { motherboardId, cpuId, gpuId, ramId, peripherals = 5 } = req.body;

    // Verificar que los ID recibidos sean números
    if (![motherboardId, cpuId, gpuId, ramId].every(Number.isInteger)) {
      return res
        .status(400)
        .json({ message: "❌ Los IDs deben ser números válidos" });
    }

    // Valores estimados de consumo en watts
    const DISK_POWER_WATTAGE = 10; // Promedio por disco
    const RAM_POWER_WATTAGE = 5; // Promedio por módulo de RAM
    const PERIPHERAL_POWER_WATTAGE = 5; // Por cada periférico conectado

    // Obtener los componentes de la base de datos
    const [motherboard, cpu, gpu, ram, psus] = await Promise.all([
      prisma.componente.findUnique({
        where: { id_componente: motherboardId },
        select: { especificaciones: true },
      }),
      prisma.componente.findUnique({
        where: { id_componente: cpuId },
        select: { especificaciones: true },
      }),
      prisma.componente.findUnique({
        where: { id_componente: gpuId },
        select: { especificaciones: true },
      }),
      prisma.componente.findUnique({
        where: { id_componente: ramId },
        select: { especificaciones: true },
      }),
      prisma.componente.findMany({
        where: { categoria: "Power Supply" },
        select: {
          id_componente: true,
          nombre: true,
          marca: true,
          precio: true,
          especificaciones: true,
        },
      }),
    ]);

    // Verificar si los componentes fueron encontrados
    if (!motherboard)
      return res.status(404).json({ message: "❌ Motherboard no encontrada" });
    if (!cpu) return res.status(404).json({ message: "❌ CPU no encontrada" });
    if (!gpu) return res.status(404).json({ message: "❌ GPU no encontrada" });
    if (!ram) return res.status(404).json({ message: "❌ RAM no encontrada" });

    // Calcular consumo total de energía
    const cpuTDP = parseInt(cpu.especificaciones?.["TDP"]) || 0;
    const gpuTDP = parseInt(gpu.especificaciones?.["TDP"]) || 0;
    const motherboardTDP =
      parseInt(motherboard.especificaciones?.["TDP"]) || 80; // Estimación de motherboard si no hay dato
    const ramModules =
      parseInt(ram.especificaciones?.["Modules"]?.split(" x ")[0]) || 1;
    const ramTDP = ramModules * RAM_POWER_WATTAGE;
    const disksTDP =
      (motherboard.especificaciones?.["SATA"] || 0) * DISK_POWER_WATTAGE;
    const peripheralsTDP = peripherals * PERIPHERAL_POWER_WATTAGE;

    const totalPowerConsumption =
      cpuTDP + gpuTDP + motherboardTDP + ramTDP + disksTDP + peripheralsTDP;
    const requiredPower = Math.ceil(totalPowerConsumption * 1.3); // Agregar margen del 20%

    console.log(`Consumo estimado: ${totalPowerConsumption}W`);
    console.log(`Potencia requerida con margen: ${requiredPower}W`);

    // Verificar compatibilidad de conectores
    const requiredEPS = motherboard.especificaciones?.[
      "Socket / CPU"
    ]?.includes("LGA")
      ? 1
      : 2;
    const requiredPCIe =
      (gpu.especificaciones?.["External Power"]?.match(/\d+/g) || []).reduce(
        (a, b) => a + parseInt(b),
        0
      ) / 8;

    console.log(`Conectores EPS requeridos: ${requiredEPS}`);
    console.log(`Conectores PCIe requeridos: ${requiredPCIe}`);

    // Filtrar fuentes de poder compatibles
    const compatiblePSUs = psus.filter((psu) => {
      const psuWattage = parseInt(psu.especificaciones?.["Wattage"]) || 0;
      const epsConnectors =
        parseInt(psu.especificaciones?.["EPS 8-Pin Connectors"]) || 0;
      const pcie8Pin =
        parseInt(psu.especificaciones?.["PCIe 8-Pin Connectors"]) || 0;
      const pcie6plus2Pin =
        parseInt(psu.especificaciones?.["PCIe 6+2-Pin Connectors"]) || 0;

      return (
        psuWattage >= requiredPower &&
        epsConnectors >= requiredEPS &&
        pcie8Pin + pcie6plus2Pin >= requiredPCIe
      );
    });

    console.log(`Fuentes compatibles encontradas: ${compatiblePSUs.length}`);

    res.json(compatiblePSUs);
  } catch (error) {
    console.error("❌ Error en getCompatiblePSUs:", error);
    res.status(500).json({
      message: `Error al obtener fuentes de poder compatibles: ${error.message}`,
    });
  }
};

//Function to get the case compatible with a motherboard and PSU.
export const getCompatibleCases = async (req, res) => {
  try {
    const { motherboardId, gpuId, psuId } = req.body;
    console.log("🔍 Datos recibidos en req.body:", req.body);

    // Obtener los componentes de la base de datos
    const [motherboard, gpu, psu, cases] = await Promise.all([
      prisma.componente.findUnique({
        where: { id_componente: motherboardId },
        select: { especificaciones: true },
      }),
      prisma.componente.findUnique({
        where: { id_componente: gpuId },
        select: { especificaciones: true },
      }),
      prisma.componente.findUnique({
        where: { id_componente: psuId },
        select: { especificaciones: true },
      }),
      prisma.componente.findMany({
        where: { categoria: "Case" },
        select: {
          id_componente: true,
          nombre: true,
          marca: true,
          precio: true,
          especificaciones: true,
        },
      }),
    ]);

    // Verificar si los componentes fueron encontrados
    if (!motherboard)
      return res.status(404).json({ message: "❌ Motherboard no encontrada" });
    if (!gpu) return res.status(404).json({ message: "❌ GPU no encontrada" });
    if (!psu) return res.status(404).json({ message: "❌ PSU no encontrada" });

    // Obtener especificaciones clave
    const motherboardFormFactor =
      motherboard.especificaciones?.["Form Factor"] || "";
    const gpuMaxLength =
      parseInt(gpu.especificaciones?.["Length"]?.replace(" mm", ""), 10) || 0;
    const psuFormFactor = psu.especificaciones?.["Type"] || "";

    console.log(`Factor de forma de la motherboard: ${motherboardFormFactor}`);
    console.log(`Longitud de la GPU: ${gpuMaxLength} mm`);
    console.log(`Factor de forma de la PSU: ${psuFormFactor}`);

    // Filtrar gabinetes compatibles
    const compatibleCases = cases.filter((pcCase) => {
      const supportedFormFactors =
        pcCase.especificaciones?.["Motherboard Form Factor"] || [];

      const maxGpuLengthRaw =
        pcCase.especificaciones?.["Maximum Video Card Length"];
      const maxGpuLength =
        maxGpuLengthRaw && typeof maxGpuLengthRaw === "string"
          ? parseInt(maxGpuLengthRaw.split(" mm")[0], 10) // Tomamos solo la parte en mm
          : Infinity;

      // Determinar compatibilidad de PSU basándonos en el "Type" del gabinete
      const caseType = pcCase?.especificaciones?.["Type"] || "";
      const caseSupportsATXPSU = caseType.includes("ATX");
      const caseSupportsSFXPSU =
        caseType.includes("SFX") || caseType.includes("Mini ITX");

      const psuCompatibility =
        (psuFormFactor === "ATX" && caseSupportsATXPSU) ||
        (psuFormFactor.includes("SFX") && caseSupportsSFXPSU);

      return (
        supportedFormFactors.includes(motherboardFormFactor) &&
        gpuMaxLength <= maxGpuLength &&
        psuCompatibility
      );
    });

    console.log(
      `✅ Gabinetes compatibles encontrados: ${compatibleCases.length}`
    );

    res.json(compatibleCases);
  } catch (error) {
    console.error("❌ Error en getCompatibleCases:", error);
    res.status(500).json({
      message: `Error al obtener gabinetes compatibles: ${error.message}`,
    });
  }
};

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
