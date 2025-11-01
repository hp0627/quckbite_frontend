import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASEURL, callApi, setSession } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    errorMessage: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const forgotPassword = () => {
    const { email } = formData;
    if (email === '') {
      setFormData(prev => ({ ...prev, errorMessage: 'Please enter your email to reset password.' }));
      return;
    }

    const url = `${BASEURL}users/forgotpassword/${email}`;
    callApi('GET', url, null, (response) => {
      try {
        console.log('Forgot password response:', response);
        if (!response.includes('::')) {
          setFormData(prev => ({
            ...prev,
            errorMessage: 'Unexpected server response.'
          }));
          return;
        }

        const [statusCode, message] = response.split('::');
        if (statusCode === '200') {
          setFormData(prev => ({
            ...prev,
            errorMessage: 'Password reset link has been sent to your email.'
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            errorMessage: message || 'Failed to send reset link.'
          }));
        }
      } catch (error) {
        console.error('Error in forgot password:', error);
        setFormData(prev => ({
          ...prev,
          errorMessage: 'Failed to process request. Please try again.'
        }));
      }
    });
  };

  const signin = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (email === '' || password === '') {
      setFormData(prev => ({ ...prev, errorMessage: 'Email and password are required.' }));
      return;
    }

    const data = JSON.stringify({ email, password });
    console.log('Sending login request:', { email, url: BASEURL + 'users/signin' });

    callApi('POST', BASEURL + 'users/signin', data, signinResponse);
  };

  const signinResponse = (res) => {
    try {
      console.log('Raw response:', res);
      if (!res.includes('::')) {
        setFormData(prev => ({ ...prev, errorMessage: 'Invalid response from server' }));
        return;
      }

      const [statusCode, message, role, token] = res.split('::');
      console.log('Split response:', [statusCode, message, role, token]);

      if (statusCode === '200') {
        setSession('token', token, 1);
        setSession('csrid', message, 1);
        setSession('role', role, 1);

        switch (role) {
          case 'user':
            navigate('/user-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'restaurant':
            navigate('/restaurant-dashboard');
            break;
          default:
            navigate('/restaurants');
        }
      } else {
        setFormData(prev => ({ ...prev, errorMessage: message || 'Login failed' }));
      }
    } catch (error) {
      console.error('Error parsing login response:', error, 'Response:', res);
      setFormData(prev => ({ ...prev, errorMessage: 'An error occurred during login' }));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to QuickBite</h2>
        <form onSubmit={signin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-300 transition-colors duration-300"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <div className="mt-1 text-right">
              <button type="button" onClick={forgotPassword} className="text-sm text-orange-500 hover:text-orange-600">
                Forgot Password?
              </button>
            </div>
          </div>
          {formData.errorMessage && (
            <div className="mb-4 text-center text-red-500">
              {formData.errorMessage}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-orange-500 hover:text-orange-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
