"use client";

import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import useSWR from 'swr';


const fetcher = async (url) => {
  const session = await getSession();
  const token = session?.user?.accessToken;

  if (!token) {
    throw new Error("You must be signed in to access this page");
  }

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};


const BrainstormingDetail = ({ params }) => {
  const router = useRouter();
  const [error, setError] = useState(null);

  const { data: brains, error: swrError } = useSWR(
    params?.id ? `${process.env.NEXT_PUBLIC_API_PRO}/api/brainstorming/${params.id}` : null,
    fetcher,
    { refreshInterval: 3000 },
    { suspense: true } // refresh setiap 5 detik
  );

  useEffect(() => {
    if (swrError) {
      console.error("Error fetching brainstorming session:", swrError);
      setError(swrError.message || 'Something went wrong');
    }
  }, [swrError]);

  useEffect(() => {
    if (!brains && swrError) {
      router.push("/login");
    }
  }, [brains, swrError, router]);

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <Suspense fallback={<div className='w-full h-screen flex items-center justify-center'>Loading...</div>}>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">{brains?.title}</h1>
        <p className="text-gray-700 dark:text-gray-400 mb-6">{brains?.description}</p>

        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Participants</h2>
          <ul className="list-disc list-inside mt-2">
            {brains?.participants?.map((participant, index) => (
              <li key={index}>{participant}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Ideas</h2>
          <div className="mt-4 space-y-4">
            {brains?.ideas?.map((idea, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg shadow">
                <p className="text-lg">{idea.content}</p>
                <div className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-400 mt-2">
                  <span>By: {idea.author}</span>
                  <span>{new Date(idea.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 text-xs font-medium text-gray-700 dark:text-gray-400">
                  Votes: {idea.votes}
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold">Comments</h3>
                  {idea.comments.length > 0 ? (
                    idea.comments.map((comment, idx) => (
                      <div key={idx} className="pl-4 border-l-2 border-gray-300">
                        <p>{comment.content}</p>
                        <span className="text-xs text-gray-500">
                          By: {comment.author} on {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No comments yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default BrainstormingDetail;
