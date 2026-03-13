-- CreateTable
CREATE TABLE "other_assets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "agency" TEXT,
    "note" TEXT,
    "value" DECIMAL(10,2) NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "other_assets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "other_assets" ADD CONSTRAINT "other_assets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
