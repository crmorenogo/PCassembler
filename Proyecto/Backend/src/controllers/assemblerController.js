/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registrarEnsamble = async (req, res) => {
  try {
    // 1️⃣ Obtener y verificar el token del usuario
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Token recibido:", token); // 🔍 Verifica el token recibido

    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // 2️⃣ Decodificar el token para obtener el ID del usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Datos decodificados del token:", decoded); // 🔍 Verifica el contenido del token

    const userId = decoded.id;
    console.log("ID de usuario extraído:", userId); // 🔍 Verifica que el ID de usuario no sea undefined

    if (!userId) {
      return res.status(400).json({ error: "Error: El ID de usuario no se encontró en el token" });
    }

    // 3️⃣ Obtener los IDs de los 8 componentes desde el body
    const { nombre, componentes } = req.body;
    console.log("Componentes recibidos:", componentes); // 🔍 Verifica el array de componentes

    if (!nombre || !componentes || componentes.length !== 8) {
      return res.status(400).json({ error: "Debes proporcionar un nombre y exactamente 8 componentes" });
    }

    // 4️⃣ Verificar si los componentes existen en la base de datos
    const componentesDB = await prisma.componente.findMany({
      where: { id_componente: { in: componentes } },
      select: { id_componente: true, precio: true },
    });

    console.log("Componentes encontrados en la DB:", componentesDB); // 🔍 Verifica los componentes encontrados

    if (componentesDB.length !== 8) {
      return res.status(400).json({ error: "Uno o más componentes no existen en la base de datos" });
    }

    // 5️⃣ Calcular el costo total de los componentes
    const costoTotal = componentesDB.reduce((sum, c) => sum + c.precio, 0);
    console.log("Costo total calculado:", costoTotal); // 🔍 Verifica el costo total

    // 6️⃣ Crear el ensamble en la base de datos
    const nuevoEnsamble = await prisma.ensamble.create({
      data: {
        nombre,
        id_usuario: userId, // 🔍 Verifica que no sea undefined
        costo_total: costoTotal,
        Ensamble_Componente: {
          create: componentes.map((id_componente) => ({
            Componente: { connect: { id_componente } },
          })),
        },
      },
      include: { Ensamble_Componente: true },
    });

    console.log("Ensamble registrado con éxito:", nuevoEnsamble); // 🔍 Verifica el objeto final creado en Prisma

    res.status(201).json({
      mensaje: "Ensamble registrado con éxito",
      ensamble: nuevoEnsamble,
    });

  } catch (error) {
    console.error("Error al registrar el ensamble:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};




//Obtener ensambles del usuario


export async function obtenerEnsamblesUsuario(req, res) {
  try {
    // Obtener el token del header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // Buscar los ensambles del usuario y cargar solo los nombres de los componentes y sus precios
    const ensambles = await prisma.ensamble.findMany({
      where: { id_usuario: decoded.id },
      include: {
        Ensamble_Componente: {
          include: {
            Componente: {
              select: {
                nombre: true,
                categoria: true,
                precio: true,
              },
            },
          },
        },
      },
    });

    // Definir el orden de categorías deseado
    const ordenCategorias = [
      "Motherboard",
      "CPU",
      "Video Card",
      "Memory",
      "Storage",
      "Power Supply",
      "Case",
      "Monitor",
    ];

    // Formatear la respuesta organizando los componentes por categoría
    const ensamblesOrganizados = ensambles.map((ensamble) => {
      const componentesOrdenados = {};
      let costoTotal = 0;

      // Inicializar las categorías en el objeto de salida
      ordenCategorias.forEach((categoria) => {
        componentesOrdenados[categoria] = null;
      });

      // Asignar los componentes según su categoría y sumar los precios
      ensamble.Ensamble_Componente.forEach(({ Componente }) => {
        if (ordenCategorias.includes(Componente.categoria)) {
          componentesOrdenados[Componente.categoria] = Componente.nombre;
        }
        costoTotal += Componente.precio; // Sumar el precio del componente
      });

      return {
        nombre_ensamble: ensamble.nombre,
        costo_total: costoTotal.toFixed(2), // Redondear a dos decimales
        componentes: componentesOrdenados,
      };
    });

    return res.status(200).json({ ensambles: ensamblesOrganizados });
  } catch (error) {
    console.error("Error al obtener ensambles:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    await prisma.$disconnect();
  }
}
