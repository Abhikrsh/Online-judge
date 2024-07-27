import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CodeForm from './CodeForm';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError("No access token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/main/problems/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setProblem(response.data);
      } catch (error) {
        console.error("There was an error fetching the problem!", error);
        setError("Failed to fetch problem. Please make sure you are logged in.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>{problem.title}</h1>
      <p>{problem.statement}</p>
      <CodeForm pid={id} />
    </div>
  );
};

export default ProblemDetail;
