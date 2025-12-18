"use server"
import "server-only";

export const migrateCart = async (fromUserId: string, toUserId: string) => {
  console.log(fromUserId, toUserId);
}