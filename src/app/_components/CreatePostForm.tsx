"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useToast } from "~/components/providers/ToastProvider";

export const CreatePostForm = () => {
  const [name, setName] = useState("");
  const { showToast } = useToast();

  const utils = api.useUtils();

  const { mutate, isPending } = api.post.create.useMutation({
    onSuccess: async () => {
      setName("");
      showToast("Post created successfully!", "success");
      await utils.post.getLatest.invalidate();
    },
    onError: (error) => {
      let errorMessage: string;

      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        errorMessage = error.message;
      } else {
        errorMessage = "An unknown error occurred during post creation.";
      }

      console.error("Post creation failed:", error);
      showToast(errorMessage, "error");
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
      className="mt-8 flex w-full max-w-2xl flex-col gap-4"
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
        className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
        disabled={isPending || !name.trim()}
      >
        {isPending ? "Creating Post..." : "Create Post"}
      </button>
    </form>
  );
};
