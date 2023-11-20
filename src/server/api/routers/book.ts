import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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
      try {
        await ctx.db.book.create({
          data: {
            bookTitle: input.bookTitle,
            author: input.author,
            image: input.image,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  //private procedure to get all books
  getAllBooks: publicProcedure.query(({ ctx }) => {
    return ctx.db.book.findMany();
  }),
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
        include: {
          chapters: {
            orderBy: {
              chapterNumber: "asc",
            },
          },
        },
      });
    }),
  createBookSession: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.bookSession.create({
          data: {
            bookId: input.bookId,
            userId: input.userId,
            progress: 1,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getBookSession: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        bookId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.bookSession.findFirst({
        where: {
          userId: input.userId,
          bookId: input.bookId,
        },
      });
    }),
});
