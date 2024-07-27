
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/Registration';
import ProblemList from './components/ProblemList';
import ProblemDetail from './components/ProblemView';
import StatusPage from './components/Status';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
const App = () => {
  return (
    <Router >
        <Routes >
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm/>} />
          <Route path="/ProblemsList" element={<ProblemList/>} />
          <Route path="/problem/:id" element={<ProblemDetail />} />
          <Route path="/status" element={<StatusPage/>} />
          <Route path="/leaderboard" element={<Leaderboard/>} />
          <Route path="/Profile" element={<Profile/>} />
          
        </Routes>
    </Router>
  )
}

export default App
