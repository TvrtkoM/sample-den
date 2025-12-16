/*
  Warnings:

  - You are about to drop the `ProcessedWebhookEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ProcessedWebhookEvent";

-- CreateTable
CREATE TABLE "processed-webhook-event" (
    "stripeEventId" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "processed-webhook-event_pkey" PRIMARY KEY ("stripeEventId")
);
