import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Optional: for custom styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <h3>Logo</h3>
      <ul className='nav-cont'>
        <li><Link to="/ProblemsList">Problems</Link></li>
        <li><Link to="/Leaderboard">Leaderboard</Link></li>
        <li><Link to="/Status">Status</Link></li>
        <li><Link to="/Profile">Profile</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar; 