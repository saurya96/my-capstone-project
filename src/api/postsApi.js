const API_URL = 'http://localhost:3000';

export const postsApi = {
  getPosts: async () => {
    const response = await fetch(`${API_URL}/posts`);
    return response.json();
  },
  
  getPostById: async (id) => {
    const response = await fetch(`${API_URL}/posts/${id}`);
    return response.json();
  },
  
  createPost: async (post) => {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    return response.json();
  },
  
  updatePost: async (id, post) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    return response.json();
  },
  
  deletePost: async (id) => {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

export const getComments = async (postId) => {
  const response = await fetch(`${API_URL}/comments?postId=${postId}`);
  return response.json();
};