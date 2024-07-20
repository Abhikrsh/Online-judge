import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Registration.css'; // Import CSS file

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(""); // For general error handling
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Make a POST request to your Django backend
      const response = await axios.post(
        "http://localhost:8000/auth/api/register/",
        formData
      );

      // Registration successful
      alert('Registration successful!');
      navigate("/"); // Redirect to login page

    } catch (error) {
      // Handle specific errors from the server
      if (error.response && error.response.data) {
        setError(error.response.data.detail); // Assuming server sends detail in error response
      } else if (error.message) {
        setError(error.message); // Handle other network or unexpected errors
      } else {
        setError('Unknown error occurred'); // Fallback error message
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {error && <p className="error-message">{error}</p>} {/* Display general error message */}
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
