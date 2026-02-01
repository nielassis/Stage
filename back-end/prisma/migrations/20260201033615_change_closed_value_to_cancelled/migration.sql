/*
  Warnings:

  - The values [CLOSED] on the enum `OsStageStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OsStageStatus_new" AS ENUM ('OPEN', 'PENDING_APPROVAL', 'CANCELLED', 'COMPLETED', 'REJECTED');
ALTER TABLE "public"."OsStage" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "OsStage" ALTER COLUMN "status" TYPE "OsStageStatus_new" USING ("status"::text::"OsStageStatus_new");
ALTER TYPE "OsStageStatus" RENAME TO "OsStageStatus_old";
ALTER TYPE "OsStageStatus_new" RENAME TO "OsStageStatus";
DROP TYPE "public"."OsStageStatus_old";
ALTER TABLE "OsStage" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;
