-- CreateTable
CREATE TABLE "fixed_incomes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "agency" TEXT,
    "note" TEXT,
    "initial_investment" DECIMAL(10,2) NOT NULL,
    "current_value" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "fixed_rate" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "pos_fixed_index" TEXT NOT NULL DEFAULT 'NONE',
    "retrieved_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fixed_incomes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ticker_orders" ADD CONSTRAINT "ticker_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_incomes" ADD CONSTRAINT "fixed_incomes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
