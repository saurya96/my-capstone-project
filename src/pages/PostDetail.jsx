import React, { Suspense, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
const Comments = React.lazy(() => import('../components/Comments'));

const PostDetail = () => {
  const { id } = useParams();

  // Fetch post by id
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/posts/${id}`);
      return res.data;
    },
  });

  const queryClient = useQueryClient();

  // Like mutation for post
  const likePostMutation = useMutation({
    mutationFn: async () => {
      await axios.patch(`http://localhost:3000/posts/${id}`, {
        likes: (post.likes || 0) + 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['post', id]);
      queryClient.invalidateQueries(['posts']);
    },
  });

  if (isLoading) return <div className="text-center mt-8 text-gray-600 dark:text-gray-300">Loading post...</div>;
  if (isError || !post) return <div className="text-center mt-8 text-red-500">Unable to load post. Please try again later.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Post Card */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Post Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {(post.author || post.authorName || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {post.author || post.authorName || 'Unknown'}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {post.date || new Date(post.createdAt).toLocaleDateString() || 'Recently'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Post Image */}
          {post.image && (
            <div className="mb-6">
              <img 
                src={post.image} 
                alt="Post" 
                className="w-full h-auto max-h-96 rounded-xl shadow-lg object-cover" 
              />
            </div>
          )}

          {/* Post Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {post.content || 'No content available.'}
            </p>
          </div>

          {/* Like Button */}
          <div className="flex items-center justify-center py-4 border-t border-b border-gray-200 dark:border-gray-700">
            <button
              className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={() => likePostMutation.mutate()}
              disabled={likePostMutation.isLoading}
            >
              <span className="text-xl">👍</span>
              <span>Like ({post.likes || 0})</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comments
          </h2>
          <Suspense fallback={
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading comments...
            </div>
          }>
            <Comments postId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;