-- AlterTable
ALTER TABLE "webhook_event_failure" ADD COLUMN     "paymentIntentId" TEXT;

-- CreateIndex
CREATE INDEX "webhook_event_failure_paymentIntentId_idx" ON "webhook_event_failure"("paymentIntentId");
