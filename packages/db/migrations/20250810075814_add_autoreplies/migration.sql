-- CreateTable
CREATE TABLE "public"."Autoreply" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "reply" TEXT NOT NULL,

    CONSTRAINT "Autoreply_pkey" PRIMARY KEY ("id")
);
