/*
  Warnings:

  - The `role` column on the `Staff` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Cashier', 'Manager', 'Admin');

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'Cashier';
