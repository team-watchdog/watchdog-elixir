-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('ADMIN', 'ORGANIZATION');

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "type" "AccountType" NOT NULL DEFAULT E'ORGANIZATION',
    "reset_code_hashed" TEXT,
    "hashed_password" TEXT NOT NULL,
    "default_password" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);
