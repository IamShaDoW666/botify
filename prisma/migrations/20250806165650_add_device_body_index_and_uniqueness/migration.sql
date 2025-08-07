/*
  Warnings:

  - A unique constraint covering the columns `[body]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Device_body_key" ON "public"."Device"("body");

-- CreateIndex
CREATE INDEX "idx_device_body" ON "public"."Device"("body");
