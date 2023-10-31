"use client";

import Link from "next/link";

import { api } from "~/trpc/react";

export default function Home() {
  // When a file is dropped in the dropzone, call the `/api/addData` API to train our bot on a new PDF File
  const { data: books, isLoading: isBooksLoading } =
    api.book.getAllBooks.useQuery();

  console.log(books);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 md:mt-24">
      <div className="flex gap-8">
      {books?.map((book) => (
        <div key={book.id} className="flex flex-col items-center gap-4">
          <Link
            href={{
              pathname: `/chat/${book.id}`,
              query: { id: book.id },
            }}
          >
            <img
              src={book.image}
              className="h-60 w-40 object-cover shadow-md"
            />
          </Link>
        </div>
      ))}
      </div>
    </main>
  );
}
