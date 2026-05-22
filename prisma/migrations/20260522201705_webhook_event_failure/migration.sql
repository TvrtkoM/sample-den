-- CreateTable
CREATE TABLE "webhook_event_failure" (
    "id" SERIAL NOT NULL,
    "stripeEventId" TEXT,
    "eventType" TEXT,
    "source" TEXT NOT NULL,
    "errorName" TEXT NOT NULL,
    "errorCode" TEXT,
    "statusCode" INTEGER,
    "requestId" TEXT,
    "meta" JSONB,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_event_failure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "webhook_event_failure_stripeEventId_idx" ON "webhook_event_failure"("stripeEventId");

-- CreateIndex
CREATE INDEX "webhook_event_failure_createdAt_idx" ON "webhook_event_failure"("createdAt");
