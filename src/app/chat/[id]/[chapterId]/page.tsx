"use client";

import { useChat } from "ai/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

import Message from "../../../_components/Message";
import { api } from "~/trpc/react";

export default function Chat({
  params: { id, chapterId },
}: {
  params: { id: string; chapterId: string };
}) {
  const { data: user, isLoading: isUserLoading } = api.user.getUser.useQuery();
  const bookObj = user?.bookSessions.find((session) => session.id === id);

  const { data: book, isLoading: isBookLoading } = api.book.getBook.useQuery({
    id: bookObj?.bookId ?? "",
  });

  const { data: chapter, isLoading: isChapterLoading } =
    api.chapter.getChapterSession.useQuery({
      id: chapterId,
    });

  const currentChapter = book?.chapters.find(
    (current) => current.id === chapter?.chapterId,
  );

  console.log("currentChapter", currentChapter);

  console.log("user", user);
  console.log("book", book);
  console.log("chapter", chapter);
  // const [messageHistory, setMessageHistory] = useState([]);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id,
    body: {
      book: book?.bookTitle,
      author: book?.author,
      number: currentChapter?.chapterNumber,
      chapter: currentChapter?.chapterTitle,
    },
  });

  console.log("messages", messages);

  console.log("book", book);

  return (
    <main className="border-red flex h-full w-full">
      <div className="h-full w-2/3 border border-black pt-8">
        <h1 className="text-3xl font-bold">{book?.bookTitle}</h1>
        <h3 className="mt-2 text-lg font-medium">
          {currentChapter?.chapterNumber} - {currentChapter?.chapterTitle}{" "}
        </h3>
        <div className="flex flex-col">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        <>
          <form
            onSubmit={handleSubmit}
            className="relative mx-auto mb-5 mt-5 w-full max-w-2xl border border-black bg-white"
          >
            <input
              type="text"
              className="input-glow focus:shadow-outline w-full appearance-none rounded border px-3 py-3 pl-3 pr-10 leading-tight text-gray-200 transition-shadow duration-200 focus:outline-none"
              value={input}
              onChange={handleInputChange}
            />

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400">
              <PaperAirplaneIcon className="h-5" />
            </span>
          </form>
        </>
      </div>
      <div> hello</div>
    </main>
  );
}
