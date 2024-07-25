import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import CSS file
import { FaUser , FaLock , FaSkull} from "react-icons/fa";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterButtonClick = () => {
    navigate("/register");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/api/login/",
        formData
      );
      const { access } = response.data.tokens;
      localStorage.setItem("accessToken", access);
      console.log("Access Token:", access);
      console.log("Response Data:", response.data);
      navigate("/ProblemsList");
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        console.error("Error Response Headers:", error.response.headers);
        setError(error.response.data.detail || "Invalid credentials");
      } else if (error.request) {
        // Request was made but no response was received
        console.error("Error Request:", error.request);
        setError("No response from the server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error Message:", error.message);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="wrapper">
      <div className="heading">
        <h1 className="title-h1">
          Login to{" "}
          <span class="title-span">
            Name
          </span>
        </h1>
      </div>
      <div className="Login-form">
       <FaSkull style={{ fontSize: '50px' }}/>
        <form className="lgn-frm" onSubmit={handleSubmit}>
          <label>
          <FaUser style={{ fontSize: '28px' }}/>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
          <label>
          <FaLock style={{ fontSize: '28px' }}/>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <button className="login-btn" type="submit">
            Login
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <div className="question">
          <p>Don't have an account?</p>
          <a className="register-button" onClick={handleRegisterButtonClick}>
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
