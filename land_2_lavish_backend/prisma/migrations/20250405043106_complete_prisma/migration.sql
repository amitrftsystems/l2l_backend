-- CreateTable
CREATE TABLE "Booking" (
    "booking_id" SERIAL NOT NULL,
    "customer_id" VARCHAR(50) NOT NULL,
    "booking_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "address" TEXT NOT NULL,
    "property_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "Broker" (
    "broker_id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "code" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "mobile" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "fax" TEXT,
    "income_tax_ward_no" TEXT,
    "dist_no" TEXT,
    "pan_no" TEXT,
    "net_commission_rate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "Broker_pkey" PRIMARY KEY ("broker_id")
);

-- CreateTable
CREATE TABLE "CoApplicant" (
    "co_applicant_id" SERIAL NOT NULL,
    "customer_id" TEXT NOT NULL,
    "is_applicant" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "guardian_name" TEXT,
    "address" TEXT NOT NULL,
    "mobile" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "fax" TEXT,
    "occupation" TEXT,
    "income_tax_ward_no" TEXT,
    "dist_no" TEXT,
    "pan_no" TEXT,
    "dob" TIMESTAMP(3),
    "nationality" TEXT NOT NULL DEFAULT 'Resident Indian',

    CONSTRAINT "CoApplicant_pkey" PRIMARY KEY ("co_applicant_id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "broker_id" INTEGER,
    "property_type" TEXT,
    "booking_receipt_no" TEXT,
    "name" TEXT NOT NULL,
    "father_husband_name" TEXT,
    "grandfather_name" TEXT,
    "dob" TIMESTAMP(3),
    "permanent_address" TEXT NOT NULL,
    "full_postal_address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "email" TEXT,
    "mobile" TEXT NOT NULL,
    "std_isd_code" TEXT,
    "phone" TEXT,
    "fax" TEXT,
    "income_tax_ward_no" TEXT,
    "dist_no" TEXT,
    "pan_no" TEXT,
    "aadhar_no" TEXT,
    "gstin" TEXT,
    "paid_100_percent" BOOLEAN NOT NULL DEFAULT false,
    "nominee_name" TEXT,
    "nominee_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "InstallmentPlan" (
    "installment_no" TEXT NOT NULL,
    "due_days" INTEGER,
    "due_date" TIMESTAMP(3),
    "percentage" DOUBLE PRECISION,
    "lumpsum_amount" DOUBLE PRECISION,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstallmentPlan_pkey" PRIMARY KEY ("installment_no")
);

-- CreateTable
CREATE TABLE "LeanBank" (
    "id" SERIAL NOT NULL,
    "bank_name" TEXT NOT NULL,
    "ifsc_code" TEXT NOT NULL,
    "bank_branch" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeanBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plc" (
    "plc_id" SERIAL NOT NULL,
    "plc_name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "is_percentage" BOOLEAN NOT NULL DEFAULT false,
    "remarks" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plc_pkey" PRIMARY KEY ("plc_id")
);

-- CreateTable
CREATE TABLE "Project" (
    "project_id" SERIAL NOT NULL,
    "project_name" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "landmark" TEXT,
    "plan" TEXT NOT NULL,
    "size" INTEGER,
    "sign_image_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "Property" (
    "property_id" INTEGER NOT NULL,
    "customer_id" TEXT,
    "property_type" TEXT,
    "size" INTEGER NOT NULL,
    "allotment_date" TIMESTAMP(3),
    "remark" TEXT,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("property_id")
);

-- CreateTable
CREATE TABLE "RegistrationForm" (
    "id" SERIAL NOT NULL,
    "customer_id" TEXT NOT NULL,
    "project_id" INTEGER NOT NULL,
    "unit_id" TEXT NOT NULL,
    "manual_application_number" TEXT,
    "booking_receipt_number" TEXT,
    "name" TEXT NOT NULL,
    "father_name" TEXT,
    "grandfather_name" TEXT,
    "dob" TIMESTAMP(3),
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "state" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fax" TEXT,
    "std_code" TEXT,
    "tax_ward_no" TEXT,
    "dist_no" TEXT,
    "pan_no" TEXT,
    "aadhar_no" TEXT,
    "gstin" TEXT,
    "agent_name" TEXT,
    "nominee_name" TEXT,
    "nominee_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistrationForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "stock_id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "property_id" INTEGER NOT NULL,
    "property_type" TEXT,
    "size" INTEGER,
    "bsp" DOUBLE PRECISION,
    "broker_id" INTEGER,
    "remarks" TEXT,
    "on_hold_status" TEXT,
    "hold_till_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("stock_id")
);

-- CreateIndex
CREATE INDEX "Booking_property_id_idx" ON "Booking"("property_id");

-- CreateIndex
CREATE INDEX "Booking_customer_id_idx" ON "Booking"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "CoApplicant_mobile_key" ON "CoApplicant"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "CoApplicant_email_key" ON "CoApplicant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CoApplicant_pan_no_key" ON "CoApplicant"("pan_no");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_mobile_key" ON "Customer"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_pan_no_key" ON "Customer"("pan_no");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_aadhar_no_key" ON "Customer"("aadhar_no");

-- CreateIndex
CREATE INDEX "Customer_project_id_idx" ON "Customer"("project_id");

-- CreateIndex
CREATE INDEX "Customer_broker_id_idx" ON "Customer"("broker_id");

-- CreateIndex
CREATE UNIQUE INDEX "LeanBank_ifsc_code_key" ON "LeanBank"("ifsc_code");

-- CreateIndex
CREATE UNIQUE INDEX "Plc_plc_name_key" ON "Plc"("plc_name");

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationForm_manual_application_number_key" ON "RegistrationForm"("manual_application_number");

-- CreateIndex
CREATE UNIQUE INDEX "RegistrationForm_pan_no_key" ON "RegistrationForm"("pan_no");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("property_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Broker" ADD CONSTRAINT "Broker_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoApplicant" ADD CONSTRAINT "CoApplicant_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_broker_id_fkey" FOREIGN KEY ("broker_id") REFERENCES "Broker"("broker_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_plan_fkey" FOREIGN KEY ("plan") REFERENCES "InstallmentPlan"("installment_no") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationForm" ADD CONSTRAINT "RegistrationForm_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationForm" ADD CONSTRAINT "RegistrationForm_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "Property"("property_id") ON DELETE RESTRICT ON UPDATE CASCADE;
