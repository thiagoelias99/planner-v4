-- CreateTable
CREATE TABLE "portfolio_histories" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "snapshot_date" TIMESTAMP(3) NOT NULL,
    "variable_income_total_invested" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "variable_income_total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "share_total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "reit_total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "international_total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "gold_total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "crypto_total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "generic_variable_income_total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "cash_total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "pension_total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "fixed_income_total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "property_total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "other_total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "asset_balance_strategy_snapshot" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_history_items" (
    "id" TEXT NOT NULL,
    "portfolio_history_id" TEXT NOT NULL,
    "fixed_income_id" TEXT,
    "other_asset_id" TEXT,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "agency" TEXT,
    "note" TEXT,
    "value" DECIMAL(12,2) NOT NULL,
    "due_date" TIMESTAMP(3),
    "fixed_rate" DECIMAL(10,2),
    "pos_fixed_index" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_history_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "portfolio_histories_user_id_snapshot_date_idx" ON "portfolio_histories"("user_id", "snapshot_date");

-- CreateIndex
CREATE INDEX "portfolio_history_items_portfolio_history_id_idx" ON "portfolio_history_items"("portfolio_history_id");

-- AddForeignKey
ALTER TABLE "portfolio_histories" ADD CONSTRAINT "portfolio_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_history_items" ADD CONSTRAINT "portfolio_history_items_portfolio_history_id_fkey" FOREIGN KEY ("portfolio_history_id") REFERENCES "portfolio_histories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_history_items" ADD CONSTRAINT "portfolio_history_items_fixed_income_id_fkey" FOREIGN KEY ("fixed_income_id") REFERENCES "fixed_incomes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_history_items" ADD CONSTRAINT "portfolio_history_items_other_asset_id_fkey" FOREIGN KEY ("other_asset_id") REFERENCES "other_assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
