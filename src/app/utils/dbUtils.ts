import { type PrismaClient } from "@prisma/client";

export async function createUserInDatabase(db: PrismaClient, userId: string, email: string | undefined) {
    try {
      await db.user.create({
        data: { userId, email },
      });
    } catch (error) {
      console.log(error);
    }
  }