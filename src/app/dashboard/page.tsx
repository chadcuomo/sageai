"use client";

import Link from "next/link";

import { api } from "~/trpc/react";
import { createClient } from "../utils/supabase/client"
import { type User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const UpgradeButton = ({ push }) => {
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();
  
  return (
    <button
      className="w-fit cursor-pointer rounded-md bg-black px-5 py-2 text-lg font-semibold text-white shadow-sm duration-150 hover:bg-gray-800"
      onClick={async () => {
        const { checkoutUrl } = await createCheckoutSession();
        if (checkoutUrl) {
          void push(checkoutUrl);
        }
      }}
    >
      Upgrade account
    </button>
  );
};

export default function Dashboard() {
  const { push } = useRouter();
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  // When a file is dropped in the dropzone, call the `/api/addData` API to train our bot on a new PDF File
  const { data: books, isLoading: isBooksLoading } =
    api.book.getAllBooks.useQuery();
  const { data: userData, isLoading: isUserDataLoading } = api.user.getUser.useQuery();

  const { stripeSubscriptionStatus} = userData ?? {}

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
  console.log('userData', userData)
  console.log('user', user)

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 md:mt-24">
     
      {!isUserDataLoading && stripeSubscriptionStatus !== null && (
         <div className="flex gap-8">
            {// TODO: Move to profile page
            /* <>
              <p className="text-xl text-gray-700">
                Your subscription is {stripeSubscriptionStatus}.
              </p>
              <ManageBillingButton push={push} />
            </> */}
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
          )}
          {!isUserDataLoading && stripeSubscriptionStatus === null && (
            <div className="w-full flex flex-col items-center gap-6">
              <p className="text-xl text-gray-700">You are not currently subscribed</p>
              <UpgradeButton push={push} />
            </div>
          )}
     
      
    </main>
  );
}
