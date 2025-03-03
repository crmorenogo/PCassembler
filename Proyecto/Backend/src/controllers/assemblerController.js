/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registrarEnsamble = async (req, res) => {
  try {
    // 1️⃣ Obtener y verificar el token del usuario
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    // 2️⃣ Decodificar el token para obtener el ID del usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id_usuario;

    // 3️⃣ Obtener los IDs de los 8 componentes desde el cuerpo de la solicitud
    const { nombre, componentes } = req.body; // `componentes` debe ser un array con 8 IDs

    if (!nombre || !componentes || componentes.length !== 8) {
      return res.status(400).json({ error: "Debes proporcionar un nombre y exactamente 8 componentes" });
    }

    // 4️⃣ Verificar que los componentes existen en la base de datos
    const componentesDB = await prisma.componente.findMany({
      where: { id_componente: { in: componentes } },
      select: { id_componente: true, precio: true },
    });

    if (componentesDB.length !== 8) {
      return res.status(400).json({ error: "Uno o más componentes no existen" });
    }

    // 5️⃣ Calcular el costo total sumando los precios de los componentes
    const costoTotal = componentesDB.reduce((sum, c) => sum + c.precio, 0);

    // 6️⃣ Crear el ensamble
    const nuevoEnsamble = await prisma.ensamble.create({
      data: {
        nombre,
        id_usuario: userId,
        costo_total: costoTotal,
        Ensamble_Componente: {
          create: componentes.map(id_componente => ({
            Componente: { connect: { id_componente } }
          }))
        }
      },
      include: { Ensamble_Componente: true }
    });

    res.status(201).json({
      mensaje: "Ensamble registrado con éxito",
      ensamble: nuevoEnsamble,
    });

  } catch (error) {
    console.error("Error al registrar el ensamble:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
