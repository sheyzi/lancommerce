/*
  Warnings:

  - You are about to drop the column `product_id` on the `images` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "images_product_id_idx";

-- AlterTable
ALTER TABLE "images" DROP COLUMN "product_id";
