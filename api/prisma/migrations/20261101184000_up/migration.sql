-- AlterTable
ALTER TABLE "Fueling" ADD COLUMN     "transaction_id" TEXT;

-- AddForeignKey
ALTER TABLE "Fueling" ADD CONSTRAINT "Fueling_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transaction_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
