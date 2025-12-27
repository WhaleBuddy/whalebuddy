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
      className="mt-12 flex w-full max-w-2xl flex-col gap-6"
    >
      <div className="group relative">
        <input
          type="text"
          placeholder="Dê um nome ao seu novo post..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white transition-all focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isPending}
        />
      </div>
      <button
        type="submit"
        className="rounded-2xl bg-indigo-600 px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-indigo-500/20 disabled:text-indigo-300/40 disabled:shadow-none"
        disabled={isPending || !name.trim()}
      >
        {isPending ? "Criando Post..." : "Criar Post"}
      </button>
    </form>
  );
};
