"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

function isError(error: unknown): error is Error {
  return error instanceof Error; 
}

export function CreatePostForm() {
  const [name, setName] = useState("");
  
  const utils = api.useUtils(); 
  
  const { mutate, isLoading } = api.post.create.useMutation({
    onSuccess: async () => {
      setName("");
      await utils.post.getLatest.invalidate();
    },
    onError: (error) => {
      let errorMessage = "An unknown error occurred.";
      
      if (isError(error)) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
        errorMessage = error.message; 
      }
      
      console.error("Post creation failed:", error);
      alert(`Error: ${errorMessage}. Check console for details.`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    mutate({ name });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-2xl mt-8"
    >
      <input
        type="text"
        placeholder="Name your new post..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-black focus:border-indigo-500 focus:ring-indigo-500"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        disabled={isLoading || !name.trim()}
      >
        {isLoading ? "Creating Post..." : "Create Post"}
      </button>
    </form>
  );
}