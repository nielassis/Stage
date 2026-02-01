/*
  Warnings:

  - Added the required column `documentType` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('CPF', 'CNPJ');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "documentType" "DocumentType" NOT NULL;
