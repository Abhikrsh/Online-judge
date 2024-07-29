import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); // Ensure you have username in local storage
  const token = localStorage.getItem("accessToken"); // Ensure you have access token in local storage
  const refreshToken = localStorage.getItem("refreshToken"); // Ensure you have refresh token in local storage

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("Fetching user profile with username:", username); // Log the username
      console.log("Fetching user profile with token:", token); // Log the token

      if (!token || !username) {
        setError("No access token or username found. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/main/profile/${username}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error); // Log the error
        setError("Failed to fetch profile data.");
      }
    };

    fetchUserProfile();
  }, [username, token]); // Ensure `token` is included in dependency array

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken"); // Retrieve refresh token from local storage
    const accessToken = localStorage.getItem("accessToken"); // Retrieve access token from local storage

    if (!refreshToken) {
      setError("No refresh token found.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/auth/api/logout/",
        { refresh_token: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Use access token for authorization
          },
        }
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("username"); // Clear username on logout
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Failed to log out:", error);
      setError("Failed to log out.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>User Profile</h1>
        <div className="user-container">
          <div className="upper">
            <div className="profile">
              <p>PFP</p>
            </div>
          </div>
          <div className="lower">
            {error && <p>{error}</p>}
            <div className="user-info">
              <p>
                <strong>Username:</strong> {userData.username}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Number of Unique Accepted Submissions:</strong>{" "}
                {userData.num_unique_solved_problems}
              </p>
            </div>
            <button className="logout-btn btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
