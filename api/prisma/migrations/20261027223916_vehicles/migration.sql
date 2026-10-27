-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "plate" TEXT,
    "color" TEXT,
    "fuel_type" TEXT NOT NULL,
    "purchase_date" TIMESTAMP(3),
    "purchase_price" DECIMAL(65,30),
    "current_odometer" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "transaction_id" TEXT,
    "maintenance_transaction_id" TEXT,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fueling" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "odometer" INTEGER NOT NULL,
    "fuel_type" TEXT NOT NULL,
    "liters" DECIMAL(65,30) NOT NULL,
    "price_per_liter" DECIMAL(65,30) NOT NULL,
    "total_amount" DECIMAL(65,30) NOT NULL,
    "station" TEXT,
    "full_tank" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fueling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelConsumption" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "start_fueling_id" TEXT NOT NULL,
    "end_fueling_id" TEXT NOT NULL,
    "distance_km" DECIMAL(65,30) NOT NULL,
    "liters_consumed" DECIMAL(65,30) NOT NULL,
    "average_km_per_liter" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FuelConsumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "workshop" TEXT,
    "maintenance_date" TIMESTAMP(3) NOT NULL,
    "odometer" INTEGER NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "warranty_until" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "due_date" TIMESTAMP(3),
    "due_odometer" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "Vehicle"("plate");

-- CreateIndex
CREATE INDEX "Vehicle_owner_id_idx" ON "Vehicle"("owner_id");

-- CreateIndex
CREATE INDEX "Fueling_vehicle_id_idx" ON "Fueling"("vehicle_id");

-- CreateIndex
CREATE INDEX "Fueling_date_idx" ON "Fueling"("date");

-- CreateIndex
CREATE INDEX "Maintenance_vehicle_id_idx" ON "Maintenance"("vehicle_id");

-- CreateIndex
CREATE INDEX "Maintenance_maintenance_date_idx" ON "Maintenance"("maintenance_date");

-- CreateIndex
CREATE INDEX "Reminder_vehicle_id_idx" ON "Reminder"("vehicle_id");

-- CreateIndex
CREATE INDEX "Reminder_status_idx" ON "Reminder"("status");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_maintenance_transaction_id_fkey" FOREIGN KEY ("maintenance_transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fueling" ADD CONSTRAINT "Fueling_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelConsumption" ADD CONSTRAINT "FuelConsumption_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelConsumption" ADD CONSTRAINT "FuelConsumption_start_fueling_id_fkey" FOREIGN KEY ("start_fueling_id") REFERENCES "Fueling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelConsumption" ADD CONSTRAINT "FuelConsumption_end_fueling_id_fkey" FOREIGN KEY ("end_fueling_id") REFERENCES "Fueling"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
