import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const chapterRouter = createTRPCRouter({
  createChapterSession: protectedProcedure
    .input(
      z.object({
        bookSessionId: z.string(),
        chapterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const chapterSession = await ctx.db.chapterSession.create({
          data: {
            bookSessionId: input.bookSessionId,
            chapterId: input.chapterId,
          },
        });

        return chapterSession;
      } catch (error) {
        console.log(error);
      }
    }),
  getChapterSession: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const chapterSession = await ctx.db.chapterSession.findUnique({
          where: {
            id: input.id,
          },
        });

        return chapterSession;
      } catch (error) {
        console.log(error);
      }
    }),
});
