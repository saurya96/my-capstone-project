import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/userSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mode = useSelector(state => state.theme.mode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Fetch users from db.json
      const response = await fetch('http://localhost:3000/users');
      const users = await response.json();

      // Find user with matching email
      const user = users.find(u => u.email === email);

      if (user) {
        // In a real app, you'd verify password here
        dispatch(login({ id: user.id, name: user.name, email: user.email }));
        navigate('/feed');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
      mode === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className={`max-w-md w-full space-y-8 p-10 rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-3xl ${
        mode === 'dark' 
          ? 'bg-gray-800/90 border border-gray-700' 
          : 'bg-white/90 border border-gray-100'
      }`}>
        {/* Logo/Header Section */}
        <div className="text-center">
          <div className={`mx-auto h-16 w-16 flex items-center justify-center rounded-full mb-4 ${
            mode === 'dark'
              ? 'bg-gradient-to-br from-blue-500 to-purple-600'
              : 'bg-gradient-to-br from-blue-600 to-purple-700'
          } shadow-lg`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className={`text-4xl font-extrabold tracking-tight mb-2 ${
            mode === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome Back
          </h2>
          <p className={`text-sm ${
            mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Sign in to continue to Community Forum
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-4 py-3 rounded-r animate-shake">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-5">
            <div className="group">
              <label className={`block text-sm font-semibold mb-2 transition-colors ${
                mode === 'dark' ? 'text-gray-300 group-focus-within:text-blue-400' : 'text-gray-700 group-focus-within:text-blue-600'
              }`}>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Address
                </span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                  mode === 'dark' 
                    ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 hover:border-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 hover:border-gray-400'
                }`}
                placeholder="your.email@example.com"
                autoComplete="email"
              />
            </div>

            <div className="group">
              <label className={`block text-sm font-semibold mb-2 transition-colors ${
                mode === 'dark' ? 'text-gray-300 group-focus-within:text-blue-400' : 'text-gray-700 group-focus-within:text-blue-600'
              }`}>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Password
                </span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${
                  mode === 'dark' 
                    ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 hover:border-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 hover:border-gray-400'
                }`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-blue-300 group-hover:text-blue-200 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </span>
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${mode === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-4 ${mode === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
              New to the community?
            </span>
          </div>
        </div>

        <div className="text-center">
          <Link 
            to="/register" 
            className={`inline-flex items-center font-semibold transition-colors ${
              mode === 'dark' 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
            }`}
          >
            Create a new account
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Demo Credentials Card */}
        <div className={`mt-6 p-5 rounded-xl border-2 border-dashed transition-all hover:border-solid ${
          mode === 'dark' 
            ? 'bg-blue-900/20 border-blue-700 hover:bg-blue-900/30' 
            : 'bg-blue-50/50 border-blue-200 hover:bg-blue-50'
        }`}>
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 p-2 rounded-lg ${
              mode === 'dark' ? 'bg-blue-800' : 'bg-blue-100'
            }`}>
              <svg className={`w-5 h-5 ${
                mode === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className={`text-sm font-bold mb-2 ${
                mode === 'dark' ? 'text-blue-300' : 'text-blue-900'
              }`}>
                Try Demo Account
              </h4>
              <div className={`text-sm space-y-1 ${
                mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <p className="flex items-center">
                  <span className="font-semibold mr-2">Email:</span>
                  <code className={`px-2 py-0.5 rounded text-xs ${
                    mode === 'dark' ? 'bg-gray-800 text-blue-400' : 'bg-white text-blue-600'
                  }`}>john@example.com</code>
                </p>
                <p className="flex items-center">
                  <span className="font-semibold mr-2">Password:</span>
                  <code className={`px-2 py-0.5 rounded text-xs ${
                    mode === 'dark' ? 'bg-gray-800 text-blue-400' : 'bg-white text-blue-600'
                  }`}>any password</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
