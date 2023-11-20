"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function BookPreview({
  params: { id },
}: {
  params: { id: string };
}) {
  console.log(id);
  const { push } = useRouter();
  const { data: userData, isLoading: isUserDataLoading } =
    api.user.getUser.useQuery();
  const { data: book, isLoading: isBookLoading } = api.book.getBook.useQuery({
    id: id,
  });
  const { data: bookSession, isLoading: isBookSessionLoading } =
    api.book.getBookSession.useQuery({
      bookId: book?.id ?? "",
      userId: userData?.id ?? "",
    });

  const createChapterSession = api.chapter.createChapterSession.useMutation({
    onSuccess: (data) => {
      console.log("data", data);
      push(`/chat/${bookSession.id}/${data.id}`);
    },
  });

  const handleCreateChapterSession = () => {
    createChapterSession.mutate({
      bookSessionId: bookSession?.id ?? "",
      chapterId: book?.chapters[0]?.id ?? "",
    });
  };

  console.log("book", book);
  console.log("bookSession", bookSession);

  const { bookTitle, author, image, summary } = book ?? {};

  return (
    <main className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 md:mt-24 lg:px-8">
      <div className="flex w-full flex-col items-center justify-between gap-8 text-center">
        <h1>{bookTitle}</h1>
        <h3>{author}</h3>
        <img src={image} className="w-60" />
        <div
          className="flex flex-col gap-6"
          dangerouslySetInnerHTML={{ __html: summary ?? "" }}
        />
        <div>
          <h4 className="mb-8">
            {" "}
            Click continue to start your reading journey
          </h4>
          <button
            onClick={() => handleCreateChapterSession()}
            className="rounded-md bg-black px-4 py-2 text-white"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
