/*
  Warnings:

  - Added the required column `deviceId` to the `Autoreply` table without a default value. This is not possible if the table is not empty.
  - Made the column `contactId` on table `Blast` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Blast" DROP CONSTRAINT "Blast_campaignId_fkey";

-- AlterTable
ALTER TABLE "public"."Autoreply" ADD COLUMN     "deviceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Blast" ALTER COLUMN "contactId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Campaign" ADD COLUMN     "message" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Blast" ADD CONSTRAINT "Blast_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Blast" ADD CONSTRAINT "Blast_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Autoreply" ADD CONSTRAINT "Autoreply_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;
