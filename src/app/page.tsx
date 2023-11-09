"use client";

import Link from "next/link";

import { api } from "~/trpc/react";
import { createClient } from "./utils/supabase/client"
import { type User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

export default function Home() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  // When a file is dropped in the dropzone, call the `/api/addData` API to train our bot on a new PDF File
  const { data: books, isLoading: isBooksLoading } =
    api.book.getAllBooks.useQuery();

    useEffect(() => {
      const fetchUser = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
        setUser(user)
        }
      }
      void fetchUser()
    }
    , [supabase.auth])

  console.log(books);
  console.log('user', user)

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
