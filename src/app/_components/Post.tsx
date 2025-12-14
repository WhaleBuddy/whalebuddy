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
    <div className="mt-8 w-full max-w-2xl rounded-lg bg-white/10 p-6">
      <h3 className="mb-2 text-xl font-semibold text-white">
        Your Latest Post
      </h3>

      {latestPost ? (
        <div>
          <p className="text-lg text-white">Name: {latestPost.name}</p>
          <p className="text-sm text-gray-300">
            Created at: {latestPost.createdAt.toLocaleTimeString()}
          </p>
        </div>
      ) : (
        <p className="text-gray-400">
          You haven&apos;t created any posts yet. Time to create one!
        </p>
      )}
    </div>
  );
}
