import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Registration.css"; // Import CSS file
import { FaUser, FaLock, FaCheck , FaSkull } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      setError("Passwords do not match");
      return;
    }

    try {
      // Make a POST request to your Django backend
      const response = await axios.post(
        "http://localhost:8000/auth/api/register/",
        formData
      );

      // Registration successful
      alert("Registration successful!");
      navigate("/"); // Redirect to login page
    } catch (error) {
      // Handle specific errors from the server
      if (error.response && error.response.data) {
        setError(error.response.data.detail); // Assuming server sends detail in error response
      } else if (error.message) {
        setError(error.message); // Handle other network or unexpected errors
      } else {
        setError("Unknown error occurred"); // Fallback error message
      }
    }
  };

  return (
    <div className="wrapper">
      <div className="register-form">
      <FaSkull style={{ fontSize: '50px' }}/>
        <form className="reg-frm" onSubmit={handleSubmit}>
          <div className="fill">
            {error && <p className="error-message">{error}</p>}
            <FaUser style={{ fontSize: '28px' }} />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="fill">
            <MdEmail style={{ fontSize: '28px' }} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="fill">
            <FaLock style={{ fontSize: '28px' }} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="fill">
            <FaCheck style={{ fontSize: '28px' }} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button className="Reg-btn" type="submit">Register</button>
        </form>
        <div className="question">
          <p>Already have an account?</p>
          <a className="login-msg" onClick={() => navigate("/")}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
