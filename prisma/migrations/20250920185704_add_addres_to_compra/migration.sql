/*
  Warnings:

  - Added the required column `cep` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua` to the `Compra` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Compra" ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "rua" TEXT NOT NULL;
