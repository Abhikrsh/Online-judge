
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/Registration';

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm/>} />
          <Route path="/ProblemList" element={<RegistrationForm/>} />
        </Routes>
    </Router>
  )
}

export default App
