import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const CodeForm = ({ pid }) => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('cpp');  // Default to C++
  const [verdict, setVerdict] = useState('');
  const [runtime, setRuntime] = useState('');
  const navigate = useNavigate();

  const handleRun = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/main/run-code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Include JWT token here
        },
        body: JSON.stringify({ code, input, language })
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output);
        setVerdict(data.verdict);
        setRuntime(data.runtime);
      } else {
        setOutput(data.error);
        setVerdict('Error');
        setRuntime('');
      }
    } catch (error) {
      setOutput('An error occurred');
      setVerdict('Error');
      setRuntime('');
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/main/submit-code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Include JWT token here
        },
        body: JSON.stringify({ code, input, language, problem_id: pid })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/status');
      } else {
        setOutput(data.error);
        setVerdict('Error');
        setRuntime('');
      }
    } catch (error) {
      setOutput('An error occurred');
      setVerdict('Error');
      setRuntime('');
    }
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="py">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>
        <div>
          <label>Code:</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
            rows="10"
            cols="50"
          />
        </div>
        <div>
          <label>Input:</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Input data..."
            rows="5"
            cols="50"
          />
        </div>
        <button type="button" onClick={handleRun}>Run</button>
        <button type="button" onClick={handleSubmit}>Submit</button>
      </form>
      <h2>Output:</h2>
      <pre>{output}</pre>
      <h2>Verdict:</h2>
      <pre>{verdict}</pre>
      <h2>Runtime:</h2>
      <pre>{runtime}</pre>
    </div>
  );
}

export default CodeForm;
