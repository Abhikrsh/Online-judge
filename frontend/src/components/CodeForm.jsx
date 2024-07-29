import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CodeForm.css";
import { FaCode } from "react-icons/fa";

const CodeForm = ({ pid }) => {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp"); // Default to C++
  const [verdict, setVerdict] = useState("");
  const [runtime, setRuntime] = useState("");
  const navigate = useNavigate();

  const handleRun = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8000/main/run-code/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include JWT token here
        },
        body: JSON.stringify({ code, input, language }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output);
        setVerdict(data.verdict);
        setRuntime(data.runtime);
      } else {
        setOutput(data.error);
        setVerdict("Error");
        setRuntime("");
      }
    } catch (error) {
      setOutput("An error occurred");
      setVerdict("Error");
      setRuntime("");
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:8000/main/submit-code/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include JWT token here
        },
        body: JSON.stringify({ code, input, language, problem_id: pid }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/status");
      } else {
        setOutput(data.error);
        setVerdict("Error");
        setRuntime("");
      }
    } catch (error) {
      setOutput("An error occurred");
      setVerdict("Error");
      setRuntime("");
    }
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="lang-selector">
          <span>Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="dropdown"
          >
            <option value="py">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>
        <div className="code-container">
          <div className="code-logo">
            <FaCode /> Code:
          </div>
          <textarea
            className="code-text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
            rows="10"
            cols="50"
          />
        </div>
        <div className="input-container">
          <div className="code-logo">Input:</div>
          <textarea
            className="input-text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Input data..."
            rows="10"
            cols="50"
          />
        </div>
        <div className="run-submit">
          <button type="button" onClick={handleRun} className="btn-1">
            Run
          </button>
          <button type="button" onClick={handleSubmit} className="btn-1">
            Submit
          </button>
        </div>
      </form>
      <div className="info-after">
        <h3>Output:</h3>
        <pre>{output}</pre>
        <h3>Verdict:</h3>
        <pre>{verdict}</pre>
        <h3>Runtime:</h3>
        <pre>{runtime}</pre>
      </div>
    </div>
  );
};

export default CodeForm;
