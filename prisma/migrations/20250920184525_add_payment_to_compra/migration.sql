/*
  Warnings:

  - Added the required column `payment` to the `Compra` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CREDIT', 'PAYPAL');

-- AlterTable
ALTER TABLE "public"."Compra" ADD COLUMN     "payment" "public"."PaymentMethod" NOT NULL;
