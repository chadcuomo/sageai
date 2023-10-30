import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const bookRouter = createTRPCRouter({
  uploadBook: publicProcedure
    .input(
      z.object({
        bookTitle: z.string(),
        author: z.string(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try{
        await ctx.db.book.create({
        data: {
          bookTitle: input.bookTitle,
          author: input.author,
          image: input.image,
        },
      });
    } catch (error) {
        console.log(error)
    }
    }),
});
