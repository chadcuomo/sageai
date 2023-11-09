import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    createUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        email: z.string() || undefined,
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.create({
          data: {
            userId: input.userId,
            email: input.email,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  subscriptionStatus: publicProcedure.query(async ({ ctx }) => {
    const { auth, db} = ctx;

    if (!auth) {
      throw new Error("Not authenticated");
    }

    const data = await db.user.findUnique({
      where: {
        id: db.user?.id,
      },
      select: {
        stripeSubscriptionStatus: true,
      },
    });

    if (!data) {
      throw new Error("Could not find user");
    }

    return data.stripeSubscriptionStatus;
  }),
});