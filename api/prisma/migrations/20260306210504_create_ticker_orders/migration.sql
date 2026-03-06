-- CreateTable
CREATE TABLE "ticker_orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ticker" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticker_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ticker_orders_user_id_ticker_type_idx" ON "ticker_orders"("user_id", "ticker", "type");

-- AddForeignKey
ALTER TABLE "ticker_orders" ADD CONSTRAINT "ticker_orders_ticker_fkey" FOREIGN KEY ("ticker") REFERENCES "tickers"("symbol") ON DELETE RESTRICT ON UPDATE CASCADE;
