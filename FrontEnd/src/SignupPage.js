import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import axios from 'axios';

function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!fullName || !username || !email || !phone || !password) {
      setError('Please fill out all fields.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/auth/signup', {
        name: fullName,
        username: username,
        email: email,
        phone: phone,
        password: password,
      });
  
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.error || 'Error registering user');
    }
  };

  return (
    <div className="signup-page">
      <div className="form-wrapper">
        <div className="signup-form">
          <h1 className="text-2xl font-bold text-center mb-4">Create an Account</h1>

          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-purple-800 font-semibold mb-1" htmlFor="fullName">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-purple-800 font-semibold mb-1" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-purple-800 font-semibold mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-purple-800 font-semibold mb-1" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-purple-800 font-semibold mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-purple-900 text-white py-2 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="text-center text-purple-700 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-purple-900 font-semibold hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;