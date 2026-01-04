/*
  Warnings:

  - The values [ADMIN] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Print_stuff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Print_stuff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telephone` to the `Print_stuff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('STUDENT', 'CLASS_LEADER');
ALTER TABLE "public"."Student" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Student" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "Student" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
COMMIT;

-- AlterTable
ALTER TABLE "Print_stuff" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "telephone" TEXT NOT NULL,
ALTER COLUMN "otp" SET DEFAULT '',
ALTER COLUMN "otp_expiry" DROP NOT NULL,
ALTER COLUMN "isVerified" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Print_stuff_email_key" ON "Print_stuff"("email");
