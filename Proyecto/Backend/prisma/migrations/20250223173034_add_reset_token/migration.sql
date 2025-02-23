-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'usuario',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Componente" (
    "id_componente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "marca" TEXT NOT NULL,
    "especificaciones" TEXT,

    CONSTRAINT "Componente_pkey" PRIMARY KEY ("id_componente")
);

-- CreateTable
CREATE TABLE "Ensamble" (
    "id_ensamble" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "costo_total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ensamble_pkey" PRIMARY KEY ("id_ensamble")
);

-- CreateTable
CREATE TABLE "Ensamble_Componente" (
    "id_ensamble" INTEGER NOT NULL,
    "id_componente" INTEGER NOT NULL,

    CONSTRAINT "Ensamble_Componente_pkey" PRIMARY KEY ("id_ensamble","id_componente")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id_notificacion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "Carrito" (
    "id_carrito" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_componente" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Carrito_pkey" PRIMARY KEY ("id_carrito")
);

-- CreateTable
CREATE TABLE "HistorialCompras" (
    "id_compra" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HistorialCompras_pkey" PRIMARY KEY ("id_compra")
);

-- CreateTable
CREATE TABLE "Ensambles_Top" (
    "id_top" SERIAL NOT NULL,
    "id_ensamble" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "precio_aproximado" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Ensambles_Top_pkey" PRIMARY KEY ("id_top")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Ensambles_Top_id_ensamble_key" ON "Ensambles_Top"("id_ensamble");

-- AddForeignKey
ALTER TABLE "Ensamble" ADD CONSTRAINT "Ensamble_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ensamble_Componente" ADD CONSTRAINT "Ensamble_Componente_id_ensamble_fkey" FOREIGN KEY ("id_ensamble") REFERENCES "Ensamble"("id_ensamble") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ensamble_Componente" ADD CONSTRAINT "Ensamble_Componente_id_componente_fkey" FOREIGN KEY ("id_componente") REFERENCES "Componente"("id_componente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carrito" ADD CONSTRAINT "Carrito_id_componente_fkey" FOREIGN KEY ("id_componente") REFERENCES "Componente"("id_componente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialCompras" ADD CONSTRAINT "HistorialCompras_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ensambles_Top" ADD CONSTRAINT "Ensambles_Top_id_ensamble_fkey" FOREIGN KEY ("id_ensamble") REFERENCES "Ensamble"("id_ensamble") ON DELETE RESTRICT ON UPDATE CASCADE;
