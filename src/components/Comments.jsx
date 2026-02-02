import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux'; 
import { getComments } from '../api/postsApi';

/**
 * Comment component
 * Displays a single comment and handles reply UI
 */
const Comment = ({ comment, onReply, onLike, children }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Handle reply submission
  const handleReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText('');
      setShowReply(false);
    }
  };

  return (
    <div className="mb-4">
      <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {(comment.author || comment.authorName || 'A')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {comment.author || comment.authorName || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
              </p>
            </div>
          </div>
        </div>

        {/* Comment Content */}
        <div className="text-gray-700 dark:text-gray-300 mb-3 ml-11">
          {comment.text || comment.content}
        </div>

        {/* Comment Actions */}
        <div className="flex gap-4 items-center ml-11">
          <button
            className="text-blue-600 dark:text-blue-400 text-xs font-medium hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none flex items-center space-x-1 transition-colors"
            onClick={() => setShowReply(!showReply)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span>Reply</span>
          </button>
          <button
            className="text-pink-600 dark:text-pink-400 text-xs font-medium hover:text-pink-700 dark:hover:text-pink-300 focus:outline-none flex items-center space-x-1 transition-colors"
            onClick={() => onLike(comment)}
          >
            <span role="img" aria-label="like" className="text-base">👍</span>
            <span>Like ({comment.likes || 0})</span>
          </button>
        </div>

        {/* Reply Input */}
        {showReply && (
          <div className="mt-4 ml-11 flex gap-2">
            <input
              type="text"
              className="flex-1 border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Write a reply..."
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              onClick={handleReply}
            >
              Send
            </button>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {children && <div className="ml-8 mt-3">{children}</div>}
    </div>
  );
};

/**
 * Recursively render nested comments
 */
const renderComments = (comments, onReply, onLike) => {
  return comments.map(comment => (
    <Comment key={comment.id} comment={comment} onReply={onReply} onLike={onLike}>
      {comment.replies && comment.replies.length > 0 && (
        renderComments(comment.replies, onReply, onLike)
      )}
    </Comment>
  ));
};

/**
 * Comments component
 * Fetches and displays comments for a post, supports replies and nested comments
 */
const Comments = ({ postId }) => {
  const queryClient = useQueryClient();
  const user = useSelector(state => state.user.user); 
  const { data: comments, isLoading, isError } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
  });

  // Like mutation for comments
  const likeCommentMutation = useMutation({
    mutationFn: async (comment) => {
      await axios.patch(`http://localhost:3000/comments/${comment.id}`, {
        likes: (comment.likes || 0) + 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
    },
  });

  // Add new comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (newComment) => {
      await axios.post('http://localhost:3000/comments', newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
    },
  });

  // State for new comment input
  const [newComment, setNewComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Dummy reply handler (replace with mutation for real API)
  const handleReply = (parentId, text) => {
    // TODO: Implement mutation to add reply to backend
    alert(`Reply to comment ${parentId}: ${text}`);
  };

  // Handle new comment submit
  const handleAddComment = async (e) => {
    e.preventDefault();
    setCommentError('');
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }
    setCommentLoading(true);
    addCommentMutation.mutate({
      postId,
      content: newComment,
       authorName: user?.name || user?.username || 'Anonymous',
      createdAt: new Date().toISOString(),
      likes: 0
    }, {
      onSuccess: () => {
        setNewComment('');
        setCommentLoading(false);
      },
      onError: () => {
        setCommentError('Failed to add comment.');
        setCommentLoading(false);
      }
    });
  };

  // Loading and error UI
  if (isLoading) return <div className="text-center py-4 text-gray-500 dark:text-gray-400">Loading comments...</div>;
  if (isError) return <div className="text-red-500 text-center py-4">Unable to load comments. Please try again later.</div>;

  return (
    <div>
      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 border-2 border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-900 dark:text-white transition-all"
            placeholder="Add a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            disabled={commentLoading}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={commentLoading}
          >
            {commentLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
        {commentError && (
          <div className="mt-2 text-red-500 text-sm flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {commentError}
          </div>
        )}
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          renderComments(comments, handleReply, (comment) => likeCommentMutation.mutate(comment))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="font-medium">No comments yet</p>
            <p className="text-sm mt-1">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;