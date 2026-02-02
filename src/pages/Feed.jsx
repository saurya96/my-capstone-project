import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const fetchPosts = async () => {
  const res = await axios.get('http://localhost:3000/posts');
  return res.data;
};

const Feed = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async (post) => {
      await axios.patch(`http://localhost:3000/posts/${post.id}`, {
        likes: (post.likes || 0) + 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="ml-4 text-lg text-blue-700 dark:text-blue-300 font-semibold">Loading posts...</span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-2xl text-red-600 font-bold mb-2">Failed to load posts</span>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8 px-2 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-8 text-center">Latest Posts</h1>
        {Array.isArray(posts) && posts.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 text-lg mt-16">No posts yet. Be the first to <span className="text-blue-600 dark:text-blue-400 cursor-pointer underline" onClick={() => navigate('/new-post')}>create a post</span>!</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(Array.isArray(posts) ? posts : []).map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 flex flex-col justify-between border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition duration-200 cursor-pointer"
                tabIndex={0}
                role="region"
                aria-label={`View post: ${post.title}`}
              >
                <div onClick={() => navigate(`/posts/${post.id}`)}>
                  <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2 truncate">{post.title}</h2>
                  <p className="text-gray-700 dark:text-gray-200 mb-4 line-clamp-3">{post.content}</p>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>By {post.authorName || 'Anonymous'}</span>
                  <span>{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</span>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
                    onClick={() => likeMutation.mutate(post)}
                    aria-label="Like post"
                  >
                    👍 Like ({post.likes || 0})
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                    onClick={() => navigate(`/posts/${post.id}`)}
                    aria-label="Reply to post"
                  >
                    💬 Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;