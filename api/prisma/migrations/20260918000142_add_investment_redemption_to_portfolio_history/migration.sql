-- AlterTable
ALTER TABLE "portfolio_histories" ADD COLUMN     "investment_total" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "redemption_total" DECIMAL(12,2) NOT NULL DEFAULT 0;
