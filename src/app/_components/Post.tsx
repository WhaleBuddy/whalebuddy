"use client";

import { api } from "~/trpc/react";

export function LatestPost() {
  const { data: latestPost, isPending, error } = api.post.getLatest.useQuery();

  if (isPending) {
    return <p className="text-white">Loading your latest post...</p>;
  }

  if (error) {
    return <p className="text-red-400">Error fetching your post data.</p>;
  }

  return (
    <div className="mt-12 w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-white/10">
      <h3 className="mb-6 text-2xl font-bold tracking-tight text-white">
        Your Latest Post
      </h3>

      {latestPost ? (
        <div className="space-y-2">
          <p className="text-xl font-medium text-white/90">
            <span className="text-slate-500">Title:</span> {latestPost.name}
          </p>
          <p className="text-sm font-semibold text-indigo-400">
            Created at: {latestPost.createdAt.toLocaleTimeString()}
          </p>
        </div>
      ) : (
        <p className="text-slate-400 italic">
          You haven't created any posts yet. How about starting now?
        </p>
      )}
    </div>
  );
}
