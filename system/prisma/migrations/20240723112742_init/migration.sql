-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "GuestType" AS ENUM ('ADULT', 'CHILD', 'PWD');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLATION', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "avatar" VARCHAR(191),
    "first_name" VARCHAR(35) NOT NULL,
    "last_name" VARCHAR(35) NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "line1" VARCHAR(191) NOT NULL,
    "line2" VARCHAR(191) NOT NULL,
    "city" VARCHAR(191) NOT NULL,
    "state" VARCHAR(191) NOT NULL,
    "postalCode" VARCHAR(191) NOT NULL,
    "country" VARCHAR(191) NOT NULL,
    "mobile" VARCHAR(11) NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(191) NOT NULL,
    "mobile_verified_at" TIMESTAMP(3),
    "email_verified_at" TIMESTAMP(3),
    "emailVerificationToken" VARCHAR(191),
    "emailVerificationTokenExpiry" TIMESTAMP(3),
    "mobileVerificationToken" VARCHAR(191),
    "mobileVerificationTokenExpiry" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "terms_and_conditions" BOOLEAN NOT NULL DEFAULT false,
    "data_privacy_policy" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "alias" TEXT,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inclusions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "inclusions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amenities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodations" (
    "id" TEXT NOT NULL,
    "photo" VARCHAR(191),
    "name" VARCHAR(191) NOT NULL,
    "description" TEXT,
    "virtual_tour" VARCHAR(191),
    "is_package" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_inclusions" (
    "accommodation_id" TEXT NOT NULL,
    "inclusion_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "accommodation_inclusions_pkey" PRIMARY KEY ("accommodation_id","inclusion_id")
);

-- CreateTable
CREATE TABLE "accommodation_amenities" (
    "amenity_id" TEXT NOT NULL,
    "accommodation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "accommodation_amenities_pkey" PRIMARY KEY ("accommodation_id","amenity_id")
);

-- CreateTable
CREATE TABLE "accommodation_facilities" (
    "accommodation_id" TEXT NOT NULL,
    "facility_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "accommodation_facilities_pkey" PRIMARY KEY ("accommodation_id","facility_id")
);

-- CreateTable
CREATE TABLE "time_slots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_time" VARCHAR(10) NOT NULL,
    "end_time" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "time_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rates" (
    "id" TEXT NOT NULL,
    "accommodation_id" TEXT NOT NULL,
    "time_slot_id" TEXT NOT NULL,
    "rate" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "max_allowed_guests" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "timeSlotId" TEXT NOT NULL,
    "guestCount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "max_allowed_guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "max_excess_guests" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "timeSlotId" TEXT NOT NULL,
    "guest_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "max_excess_guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "excess_guest_charges" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "guest_type" "GuestType" NOT NULL,
    "rate" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "excess_guest_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "booking_no" TEXT NOT NULL,
    "frontId" TEXT NOT NULL,
    "backId" TEXT NOT NULL,
    "accommodation_id" TEXT NOT NULL,
    "time_slot_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "checkIn" DATE NOT NULL,
    "checkOut" DATE NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 0,
    "children" INTEGER NOT NULL DEFAULT 0,
    "pwds" INTEGER NOT NULL DEFAULT 0,
    "bookingFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "reservationFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "securityDeposit" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "BookingStatus" NOT NULL,
    "reason_for_cancellation" TEXT,
    "response_for_cancellation" TEXT,
    "reason_for_rejection" TEXT,
    "refund_qr_payment" TEXT,
    "refund_receipt" TEXT,
    "refund_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "payment_intent_id" TEXT,
    "payment_client_key" TEXT,
    "payment_option" TEXT,
    "payment_method" TEXT,
    "is_cash" BOOLEAN NOT NULL DEFAULT false,
    "amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "change" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_id_username_email_mobile_last_name_first_name_idx" ON "users"("id", "username", "email", "mobile", "last_name", "first_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_first_name_last_name_key" ON "users"("first_name", "last_name");

-- CreateIndex
CREATE UNIQUE INDEX "agreements_userId_key" ON "agreements"("userId");

-- CreateIndex
CREATE INDEX "agreements_id_idx" ON "agreements"("id");

-- CreateIndex
CREATE UNIQUE INDEX "inclusions_name_key" ON "inclusions"("name");

-- CreateIndex
CREATE INDEX "inclusions_id_name_idx" ON "inclusions"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "amenities_name_key" ON "amenities"("name");

-- CreateIndex
CREATE INDEX "amenities_id_name_idx" ON "amenities"("id", "name");

-- CreateIndex
CREATE INDEX "facilities_id_name_idx" ON "facilities"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "facilities_name_key" ON "facilities"("name");

-- CreateIndex
CREATE INDEX "accommodations_id_name_idx" ON "accommodations"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "accommodations_name_key" ON "accommodations"("name");

-- CreateIndex
CREATE INDEX "accommodation_inclusions_accommodation_id_inclusion_id_idx" ON "accommodation_inclusions"("accommodation_id", "inclusion_id");

-- CreateIndex
CREATE INDEX "accommodation_amenities_accommodation_id_amenity_id_idx" ON "accommodation_amenities"("accommodation_id", "amenity_id");

-- CreateIndex
CREATE INDEX "accommodation_facilities_accommodation_id_facility_id_idx" ON "accommodation_facilities"("accommodation_id", "facility_id");

-- CreateIndex
CREATE UNIQUE INDEX "time_slots_name_key" ON "time_slots"("name");

-- CreateIndex
CREATE INDEX "time_slots_id_name_idx" ON "time_slots"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "time_slots_name_start_time_end_time_key" ON "time_slots"("name", "start_time", "end_time");

-- CreateIndex
CREATE INDEX "rates_id_accommodation_id_time_slot_id_idx" ON "rates"("id", "accommodation_id", "time_slot_id");

-- CreateIndex
CREATE UNIQUE INDEX "rates_accommodation_id_time_slot_id_key" ON "rates"("accommodation_id", "time_slot_id");

-- CreateIndex
CREATE INDEX "max_allowed_guests_id_accommodationId_timeSlotId_idx" ON "max_allowed_guests"("id", "accommodationId", "timeSlotId");

-- CreateIndex
CREATE INDEX "max_excess_guests_id_accommodationId_timeSlotId_idx" ON "max_excess_guests"("id", "accommodationId", "timeSlotId");

-- CreateIndex
CREATE INDEX "excess_guest_charges_id_accommodationId_guest_type_idx" ON "excess_guest_charges"("id", "accommodationId", "guest_type");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_no_key" ON "bookings"("booking_no");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_user_id_checkIn_checkOut_accommodation_id_time_slo_key" ON "bookings"("user_id", "checkIn", "checkOut", "accommodation_id", "time_slot_id");

-- AddForeignKey
ALTER TABLE "agreements" ADD CONSTRAINT "agreements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_inclusions" ADD CONSTRAINT "accommodation_inclusions_accommodation_id_fkey" FOREIGN KEY ("accommodation_id") REFERENCES "accommodations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_inclusions" ADD CONSTRAINT "accommodation_inclusions_inclusion_id_fkey" FOREIGN KEY ("inclusion_id") REFERENCES "inclusions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_amenities" ADD CONSTRAINT "accommodation_amenities_accommodation_id_fkey" FOREIGN KEY ("accommodation_id") REFERENCES "accommodations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_amenities" ADD CONSTRAINT "accommodation_amenities_amenity_id_fkey" FOREIGN KEY ("amenity_id") REFERENCES "amenities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_facilities" ADD CONSTRAINT "accommodation_facilities_accommodation_id_fkey" FOREIGN KEY ("accommodation_id") REFERENCES "accommodations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_facilities" ADD CONSTRAINT "accommodation_facilities_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rates" ADD CONSTRAINT "rates_accommodation_id_fkey" FOREIGN KEY ("accommodation_id") REFERENCES "accommodations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rates" ADD CONSTRAINT "rates_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "time_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "max_allowed_guests" ADD CONSTRAINT "max_allowed_guests_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "max_allowed_guests" ADD CONSTRAINT "max_allowed_guests_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "time_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "max_excess_guests" ADD CONSTRAINT "max_excess_guests_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "max_excess_guests" ADD CONSTRAINT "max_excess_guests_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "time_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "excess_guest_charges" ADD CONSTRAINT "excess_guest_charges_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_accommodation_id_fkey" FOREIGN KEY ("accommodation_id") REFERENCES "accommodations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "time_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
