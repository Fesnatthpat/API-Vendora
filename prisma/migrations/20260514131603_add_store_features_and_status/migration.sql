-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "features" JSONB NOT NULL DEFAULT '{"enablePOS":true, "enableReports":true, "enableStaff":true}',
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';
