import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Feed from './pages/Feed';
import PostDetail from './pages/PostDetail';
import NewPost from './pages/NewPost';
import Login from './pages/Login';
import Register from './pages/Register';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from './redux/themeSlice';
import { Navigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const mode = useSelector(state => state.theme.mode);
  return (
    <nav className={`px-6 py-3 flex justify-between items-center shadow-md ${mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'}`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-extrabold tracking-tight text-blue-400 dark:text-blue-300 mr-8 drop-shadow-sm">Community Forum</span>
        <Link to="/feed" className="text-base font-medium px-3 py-1 rounded hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-blue-300 transition mr-2">Feed</Link>
        <Link to="/new-post" className="text-base font-medium px-3 py-1 rounded hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-blue-300 transition">New Post</Link>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow transition"
          onClick={() => dispatch(toggleTheme())}
        >
          {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </nav>
  );
};


const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const mode = useSelector(state => state.theme.mode);
  React.useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <Router>
      <Navbar />
      <div className="container mx-auto mt-6">
        <Routes>
          
          <Route path="/" element={<Navigate to="/feed" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/feed" element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } />
          <Route path="/posts/:id" element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          } />
          <Route path="/new-post" element={
            <ProtectedRoute>
              <NewPost />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;