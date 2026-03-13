-- CreateTable
CREATE TABLE "asset_balance_strategies" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "notes" TEXT,
    "cash_box" DECIMAL(10,2) NOT NULL DEFAULT 10,
    "fixed_income" DECIMAL(10,2) NOT NULL DEFAULT 10,
    "variable_income" DECIMAL(10,2) NOT NULL DEFAULT 10,
    "pension" DECIMAL(10,2) NOT NULL DEFAULT 10,
    "property" DECIMAL(10,2) NOT NULL DEFAULT 10,
    "share" DECIMAL(10,2) NOT NULL DEFAULT 10,
    "reit" DECIMAL(10,2) NOT NULL DEFAULT 10,
    "international" DECIMAL(10,2) NOT NULL DEFAULT 10,
    "gold" DECIMAL(10,2) NOT NULL DEFAULT 10,
    "crypto" DECIMAL(10,2) NOT NULL DEFAULT 10,
    "other" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_balance_strategies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "asset_balance_strategies_user_id_key" ON "asset_balance_strategies"("user_id");

-- AddForeignKey
ALTER TABLE "asset_balance_strategies" ADD CONSTRAINT "asset_balance_strategies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
