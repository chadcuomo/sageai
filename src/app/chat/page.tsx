"use client";

import { useChat } from "ai/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

import Message from "../_components/Message";

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat();
    
  return (
    <main className="flex h-full border justify-center">
      <div className="flex flex-col border w-full justify-between">
        <div className="flex flex-col">
        {messages.map((message) => (
            <Message key={message.id} message={message} />
        ))}
        </div>
      <>
        <form
          onSubmit={handleSubmit}
          className="mt-5 mb-5 relative bg-white border border-black max-w-2xl mx-auto w-full"
        >
          <input
            type="text"
            className="input-glow appearance-none border rounded w-full py-3 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline pl-3 pr-10 transition-shadow duration-200"
            value={input}
            onChange={handleInputChange}
          />

          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-zinc-400">
            <PaperAirplaneIcon className="h-5" />
          </span>
        </form>
      </>
      </div>
    </main>
  );
}
