"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function CreatePostForm() {
  const [name, setName] = useState("");
  
  const utils = api.useUtils(); 
  
  const { mutate, isPending } = api.post.create.useMutation({
    onSuccess: async () => {
      setName("");
      await utils.post.getLatest.invalidate();
    },
    // The 'error' argument here is usually typed as TRPCClientError<AppRouter>
    onError: (error) => {
      // Initialize message safely
      let errorMessage: string;
      
      // Check if it's the expected TRPCClientError structure
      // NOTE: We don't need a custom type guard if we use the type provided by the library.
      if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
        // FIX: Safely assign the known string message to the string variable
        errorMessage = error.message; 
      } else {
        errorMessage = "An unknown error occurred during post creation.";
      }
      
      console.error("Post creation failed:", error);
      // The alert now uses the safely assigned string
      alert(`Error: ${errorMessage}. Check console for details.`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Using nullish coalescing (??) is not necessary here as !name.trim() is a boolean check, 
    // but the original error was likely tied to the context of the error assignment.
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
        disabled={isPending}
      />
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        disabled={isPending || !name.trim()}
      >
        {isPending ? "Creating Post..." : "Create Post"}
      </button>
    </form>
  );
}