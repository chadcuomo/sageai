"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import TextInput from "../_components/TextInput";
import { api } from "~/trpc/react";

export default function UploadPdf() {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverImg, setCoverImg] = useState("");

  const addBook = api.book.uploadBook.useMutation({
    onSuccess: () => {
      setBookTitle("");
      setAuthor("");
      setCoverImg("");
    },
  });
  // When a file is dropped in the dropzone, call the `/api/addData` API to train our bot on a new PDF File
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file.type !== "application/pdf") {
        alert("Please upload a PDF");
        return;
      }

      const formData = new FormData();
      formData.set("file", file);
      formData.set("bookTitle", bookTitle);
      formData.set("author", author);

      const response = await fetch("/api/addData", {
        method: "POST",
        body: formData,
      });

      const body = await response.json();

      if (body.success) {
        addBook.mutate({ bookTitle, author, image: coverImg });
        alert(`Successfully added ${bookTitle} by ${author}`);
      }
    },
    [addBook, author, bookTitle, coverImg],
  );

  // Configure react-dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <main className="flex flex-col items-center p-24">
      <TextInput
        label="Book Title"
        value="bookTitle"
        onchange={setBookTitle}
        placeholder="Atomic Habits"
        textValue={bookTitle}
      />
      <TextInput
        label="Author"
        value="author"
        onchange={setAuthor}
        placeholder="James Clear"
        textValue={author}
      />
      <TextInput
        label="Cover Image"
        value="coverImg"
        onchange={setCoverImg}
        placeholder="https://images-na.ssl-images-amazon.com/images/I/51-nXsSRfZL._SX329_BO1,204,203,200_.jpg"
        textValue={coverImg}
      />
      <div
        {...getRootProps({
          className:
            "dropzone px-6 mt-6 py-3 rounded-md bg-black text-white hover:bg-gray-800 transition-colors duration-200 ease-in-out cursor-pointer",
        })}
      >
        <input {...getInputProps()} />

        <p>Upload a PDF to add new data</p>
      </div>
    </main>
  );
}
