import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/userSlice';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mode = useSelector(state => state.theme.mode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      // Check if user already exists
      const response = await fetch('http://localhost:3000/users');
      const users = await response.json();
      
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setError('User with this email already exists');
        return;
      }

      // Create new user
      const newUser = {
        name,
        email,
        createdAt: new Date().toISOString()
      };

      const createResponse = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (createResponse.ok) {
        const createdUser = await createResponse.json();
        dispatch(login({ id: createdUser.id, name: createdUser.name, email: createdUser.email }));
        navigate('/feed');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
      mode === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'
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
              ? 'bg-gradient-to-br from-purple-500 to-pink-600'
              : 'bg-gradient-to-br from-purple-600 to-pink-700'
          } shadow-lg`}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className={`text-4xl font-extrabold tracking-tight mb-2 ${
            mode === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Join Our Community
          </h2>
          <p className={`text-sm ${
            mode === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Create your account and start connecting
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

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-4">
            <div className="group">
              <label className={`block text-sm font-semibold mb-2 transition-colors ${
                mode === 'dark' ? 'text-gray-300 group-focus-within:text-purple-400' : 'text-gray-700 group-focus-within:text-purple-600'
              }`}>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name
                </span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 ${
                  mode === 'dark' 
                    ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 hover:border-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 hover:border-gray-400'
                }`}
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>

            <div className="group">
              <label className={`block text-sm font-semibold mb-2 transition-colors ${
                mode === 'dark' ? 'text-gray-300 group-focus-within:text-purple-400' : 'text-gray-700 group-focus-within:text-purple-600'
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 ${
                  mode === 'dark' 
                    ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 hover:border-gray-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 hover:border-gray-400'
                }`}
                placeholder="your.email@example.com"
                autoComplete="email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className={`block text-sm font-semibold mb-2 transition-colors ${
                  mode === 'dark' ? 'text-gray-300 group-focus-within:text-purple-400' : 'text-gray-700 group-focus-within:text-purple-600'
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
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 ${
                    mode === 'dark' 
                      ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 hover:border-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 hover:border-gray-400'
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <div className="group">
                <label className={`block text-sm font-semibold mb-2 transition-colors ${
                  mode === 'dark' ? 'text-gray-300 group-focus-within:text-purple-400' : 'text-gray-700 group-focus-within:text-purple-600'
                }`}>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Confirm
                  </span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 ${
                    mode === 'dark' 
                      ? 'bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 hover:border-gray-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 hover:border-gray-400'
                  }`}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3.5 px-4 mt-6 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-purple-300 group-hover:text-purple-200 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </span>
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${mode === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-4 ${mode === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
              Already a member?
            </span>
          </div>
        </div>

        <div className="text-center">
          <Link 
            to="/login" 
            className={`inline-flex items-center font-semibold transition-colors ${
              mode === 'dark' 
                ? 'text-purple-400 hover:text-purple-300' 
                : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            Sign in to your account
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
