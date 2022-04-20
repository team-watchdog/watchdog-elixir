/*
  Warnings:

  - You are about to drop the column `default_password` on the `account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "account" DROP COLUMN "default_password",
ADD COLUMN     "reset_code_sent_at" TIMESTAMP(3),
ALTER COLUMN "hashed_password" DROP NOT NULL;
