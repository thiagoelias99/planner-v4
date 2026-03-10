/*
  Warnings:

  - Added the required column `gain_loss` to the `ticker_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `new_mean_price` to the `ticker_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `new_total_quantity` to the `ticker_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previous_mean_price` to the `ticker_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previous_total_quantity` to the `ticker_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ticker_orders" ADD COLUMN     "gain_loss" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "new_mean_price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "new_total_quantity" INTEGER NOT NULL,
ADD COLUMN     "previous_mean_price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "previous_total_quantity" INTEGER NOT NULL;
