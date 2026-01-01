-- CreateEnum
CREATE TYPE "Paper" AS ENUM ('BW', 'COLOR');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'PRINTING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'MOBILE_MONEY', 'BANK_TRANSFER', 'CASH');

-- CreateTable
CREATE TABLE "Print_stuff" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "otp_expiry" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Print_stuff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class_orders" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "copies" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "paper_type" "Paper" NOT NULL DEFAULT 'BW',
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "student_id" TEXT NOT NULL,
    "print_id" TEXT NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Class_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "copies" INTEGER NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "paper_type" "Paper" NOT NULL DEFAULT 'BW',
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "student_id" TEXT NOT NULL,
    "print_id" TEXT NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "class_order_id" TEXT,
    "amount" INTEGER NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Class_orders" ADD CONSTRAINT "Class_orders_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("reg_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class_orders" ADD CONSTRAINT "Class_orders_print_id_fkey" FOREIGN KEY ("print_id") REFERENCES "Print_stuff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("reg_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_print_id_fkey" FOREIGN KEY ("print_id") REFERENCES "Print_stuff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("reg_number") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_class_order_id_fkey" FOREIGN KEY ("class_order_id") REFERENCES "Class_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
