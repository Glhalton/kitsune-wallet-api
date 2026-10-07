-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_files" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rg" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "issuing_authority" TEXT NOT NULL,
    "register_number" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "military_certification" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cnh" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "register_number" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "issue_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cnh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "electoral_cards" (
    "id" SERIAL NOT NULL,
    "document_id" INTEGER NOT NULL,
    "voter_registration" TEXT NOT NULL,
    "zone" INTEGER NOT NULL,
    "section" INTEGER NOT NULL,
    "electoral_city" TEXT NOT NULL,
    "electoral_state" TEXT NOT NULL,

    CONSTRAINT "electoral_cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "documents_user_id_type_id_idx" ON "documents"("user_id", "type_id");

-- CreateIndex
CREATE INDEX "document_files_document_id_idx" ON "document_files"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_types_name_key" ON "document_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "rg_document_id_key" ON "rg"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "cnh_document_id_key" ON "cnh"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "electoral_cards_document_id_key" ON "electoral_cards"("document_id");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_files" ADD CONSTRAINT "document_files_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rg" ADD CONSTRAINT "rg_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cnh" ADD CONSTRAINT "cnh_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electoral_cards" ADD CONSTRAINT "electoral_cards_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
