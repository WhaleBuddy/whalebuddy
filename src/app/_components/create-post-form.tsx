// src/app/_components/create-post-form.tsx

"use client"; // REQUIRED: Uses client-side hooks (useState, useMutation)

import { useState } from "react";
import { api } from "~/trpc/react";

export function CreatePostForm() {
  // State for the form input
  const [name, setName] = useState("");
  
  // Get the tRPC client context utility
  const utils = api.useUtils(); 
  
  // Use the mutation hook for the 'create' procedure
  const { mutate, isLoading } = api.post.create.useMutation({
    // onSuccess callback is executed when the post is successfully created on the backend
    onSuccess: async () => {
      // 1. Reset the input field
      setName("");
      
      // 2. Invalidate the cache for 'getLatest'. 
      // This tells tRPC/React Query to refetch the latest post data immediately, 
      // so the user sees the new post without a page refresh.
      await utils.post.getLatest.invalidate();
    },
    onError: (error) => {
      // Handle server-side errors (e.g., Zod validation error or database failure)
      console.error("Post creation failed:", error);
      alert(`Error: ${error.message}. Check console for details.`);
    },
  });

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return; // Simple validation check
    
    // Call the tRPC mutation
    // NOTE: This procedure is secured by 'protectedProcedure' on the server.
    // The user's ID is automatically accessed via ctx.session.user.id on the backend.
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