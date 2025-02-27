/*
  Warnings:

  - The `especificaciones` column on the `Componente` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `imagenUrl` to the `Componente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lowestPrice` to the `Componente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Componente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Componente" ADD COLUMN     "averageRating" DOUBLE PRECISION,
ADD COLUMN     "imagenUrl" TEXT NOT NULL,
ADD COLUMN     "lowestPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
DROP COLUMN "especificaciones",
ADD COLUMN     "especificaciones" JSONB;
