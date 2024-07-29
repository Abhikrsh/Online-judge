import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./ProblemsList.css"

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No access token found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8000/main/problems/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProblems(response.data);
      } catch (error) {
        console.error("There was an error fetching the problems!", error);
        setError(
          "Failed to fetch problems. Please make sure you are logged in."
        );
      }
    };

    fetchProblems();
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div className="problem-table">
        {error && <p>{error}</p>}
        <table>
          <thead>
            <tr>
              <th>Problems</th>
              <th>Difficulty</th>
              <th>Acceptance</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr key={problem.id}>
                <td>
                  <a href={`/problem/${problem.id}`}>{problem.title}</a>
                </td>
                <td>{problem.difficulty}</td>
                <td>{problem.acceptance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemList;
