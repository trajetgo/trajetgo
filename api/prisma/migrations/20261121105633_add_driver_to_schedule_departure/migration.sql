-- AlterTable
ALTER TABLE "schedule_departures" ADD COLUMN     "driverId" TEXT;

-- CreateIndex
CREATE INDEX "schedule_departures_driverId_idx" ON "schedule_departures"("driverId");

-- AddForeignKey
ALTER TABLE "schedule_departures" ADD CONSTRAINT "schedule_departures_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
