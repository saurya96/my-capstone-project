import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NewPost = () => {
  const [title, setTitle] = useState('');
  const titleRef = useRef(null);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:3000/posts', {
        title,
        content,
        image,
        authorName: user?.name || user?.username || 'Anonymous',
        createdAt: new Date().toISOString(),
        likes: 0
      });
      navigate('/feed');
    } catch (err) {
      setError('Error submitting post. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 mb-6 text-center">Create New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Title</label>
            <input
              type="text"
              ref={titleRef}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              placeholder="Enter post title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Content</label>
            <textarea
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              placeholder="Write your post content here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={6}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-2 flex justify-center">
                <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg shadow" />
              </div>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-150 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Submit Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPost;