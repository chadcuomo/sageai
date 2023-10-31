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
    //private procedure to get all books
    getAllBooks: publicProcedure.query(({ ctx }) => {
      return ctx.db.book.findMany();
    }
    ),
    // procedure to get a single book based on id
    getBook: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.book.findUnique({
        where: {
          id: input.id,
        },
      });
    }
    ),
});
