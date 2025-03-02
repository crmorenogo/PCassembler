-- CreateTable
CREATE TABLE "CompatibilidadSocketChipset" (
    "id" SERIAL NOT NULL,
    "socket" TEXT NOT NULL,
    "chipset" TEXT NOT NULL,

    CONSTRAINT "CompatibilidadSocketChipset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompatibilidadSocketChipsetToComponente" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CompatibilidadSocketChipsetToComponente_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompatibilidadSocketChipsetToComponente_B_index" ON "_CompatibilidadSocketChipsetToComponente"("B");

-- AddForeignKey
ALTER TABLE "_CompatibilidadSocketChipsetToComponente" ADD CONSTRAINT "_CompatibilidadSocketChipsetToComponente_A_fkey" FOREIGN KEY ("A") REFERENCES "CompatibilidadSocketChipset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompatibilidadSocketChipsetToComponente" ADD CONSTRAINT "_CompatibilidadSocketChipsetToComponente_B_fkey" FOREIGN KEY ("B") REFERENCES "Componente"("id_componente") ON DELETE CASCADE ON UPDATE CASCADE;
