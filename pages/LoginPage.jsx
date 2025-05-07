import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post('https://hospital-management-system-cdk2.onrender.com/api/auth/login', form);
      
      // Store token in localStorage
      localStorage.setItem('accessToken', res.data.accessToken);

      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-pink-600 mb-6">Login</h2>
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <input 
              type="email" 
              placeholder="Email" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required 
            />
          </div>

          {/* Password with toggle */}
          <div className="relative mb-6">
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-pink-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
