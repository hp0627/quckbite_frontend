import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      email: '',
      role: '',
      password: '',
      confirmpassword: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  userRegistration = async () => {
    const { fullname, email, role, password, confirmpassword } = this.state;

    if (!fullname || !email || !role || !password || !confirmpassword) {
      alert('Please fill in all fields.');
      return;
    }

    if (password !== confirmpassword) {
      alert('Passwords do not match!');
      return;
    }

    const data = { fullname, email, role, password };

    try {
      const response = await fetch('http://localhost:8082/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.text();
      alert(result);

      if (response.ok) {
        this.setState({
          fullname: '',
          email: '',
          role: '',
          password: '',
          confirmpassword: ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server.');
    }
  };

  render() {
    const { fullname, email, role, password, confirmpassword } = this.state;

    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="fullname" className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <input
                type="text"
                id="fullname"
                value={fullname}
                onChange={this.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={this.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Are you a</label>
              <select
                id="role"
                value={role}
                onChange={this.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select role</option>
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_RESTAURANT">Restaurant</option>
                <option value="ROLE_EMPLOYEE">Employee</option>
                <option value="ROLE_USER">User</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={this.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmpassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmpassword"
                value={confirmpassword}
                onChange={this.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <button
              type="button"
              onClick={this.userRegistration}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-600">Login</Link>
          </p>
        </div>
      </div>
    );
  }
}

export default Signup;
