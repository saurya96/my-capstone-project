import React from 'react';

const PostCard = ({ title, author, time, likes, comments, onLike, onReply }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="text-gray-600 mb-1">By {author || 'Unknown'}</div>
      <div className="text-gray-400 text-sm mb-2">{time || 'No time'}</div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-blue-500 font-semibold">Likes: {likes || 0}</span>
        <span className="text-green-500 font-semibold">Comments: {comments || 0}</span>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={onLike}
        >
          Like
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          onClick={onReply}
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default PostCard;
