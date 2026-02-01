/*
  Warnings:

  - The values [TRIAL] on the enum `TenantStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `trialEndAt` on the `Tenant` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TenantStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
ALTER TABLE "Tenant" ALTER COLUMN "status" TYPE "TenantStatus_new" USING ("status"::text::"TenantStatus_new");
ALTER TYPE "TenantStatus" RENAME TO "TenantStatus_old";
ALTER TYPE "TenantStatus_new" RENAME TO "TenantStatus";
DROP TYPE "public"."TenantStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Tenant" DROP COLUMN "trialEndAt";
