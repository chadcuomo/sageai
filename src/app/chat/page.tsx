"use client";

import { useChat } from "ai/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

import Message from "../_components/Message";

const mockMessages = [
    {
        content: "Can you give me a brief summary of the book?",
        role: "user",
        createdAt: "2023-10-29T00:12:19.964Z",
        id: "Zqx2B4E"
    },
    {
        id: "a5S0tGr",
        createdAt: "2023-10-29T00:12:23.069Z",
        content: "Certainly! \"Atomic Habits\" by James Clear is a self-help book that explores the power of small habits and how they can have a significant impact on our lives. The book provides a step-by-step framework for creating and maintaining good habits, as well as breaking bad ones. Clear emphasizes the importance of the \"atomic\" nature of habits, meaning that they are small and incremental actions that compound over time. By focusing on the process of habit formation, rather than just the end result, Clear shows readers how to make lasting changes in their behavior and achieve long-term success. The book also delves into the psychology behind habits and provides practical strategies for overcoming common obstacles. Overall, \"Atomic Habits\" offers actionable advice and insights to help readers transform their lives by harnessing the power of small habits.",
        role: "assistant"
    }
]

export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat();
    
  return (
    <main className="flex h-full border justify-center">
      <div className="flex flex-col border w-full justify-between">
        <div className="flex flex-col">
        {mockMessages.map((message) => (
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
