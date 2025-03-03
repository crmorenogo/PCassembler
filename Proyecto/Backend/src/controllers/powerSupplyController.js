
//PSU compatibles con una motherboard, CPU, GPU y RAM
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
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
          averageRating: true,
          imagenUrl: true,
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