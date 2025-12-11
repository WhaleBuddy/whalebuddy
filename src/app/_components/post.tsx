// src/app/_components/post.tsx

"use client"; // REQUIRED: This component uses client-side hooks like useQuery

import { api } from "~/trpc/react";

export function LatestPost() {
  // Use the useQuery hook to fetch the latest post for the current authenticated user.
  const { data: latestPost, isLoading, isError } = api.post.getLatest.useQuery();

  if (isLoading) {
    return <p className="text-white">Loading your latest post...</p>;
  }

  if (isError) {
    return <p className="text-red-400">Error fetching your post data.</p>;
  }

  // Display logic based on the user's fetched data
  return (
    <div className="w-full max-w-2xl mt-8 rounded-lg bg-white/10 p-6">
      <h3 className="text-xl font-semibold text-white mb-2">Your Latest Post</h3>
      
      {latestPost ? (
        // Data found: show the post name and date
        <div>
          <p className="text-lg text-white">Name: {latestPost.name}</p>
          <p className="text-sm text-gray-300">
            Created at: {latestPost.createdAt.toLocaleTimeString()}
          </p>
        </div>
      ) : (
        // No data found: prompt the user to create one
        <p className="text-gray-400">
          You haven't created any posts yet. Time to create one!
        </p>
      )}
    </div>
  );
}

// NOTE: You must also ensure your CreatePost component is available, 
// but for now, we focus on fetching the data.