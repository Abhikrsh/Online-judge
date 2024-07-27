import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const StatusPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError("No access token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:8000/main/submissions/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const sortedSubmissions = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setSubmissions(sortedSubmissions);
      } catch (error) {
        console.error("There was an error fetching the submissions!", error);
        setError("Failed to fetch submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Status</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Problem</th>
            <th>Language</th>
            <th>Runtime</th>
            <th>Verdict</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map(submission => (
            <tr key={submission.id}>
              <td>{submission.username}</td>
              <td>{submission.problem_title}</td>
              <td>{submission.language}</td>
              <td>{submission.runtime}</td>
              <td>{submission.status}</td>
              <td>{format(new Date(submission.timestamp), 'PPpp')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatusPage;
