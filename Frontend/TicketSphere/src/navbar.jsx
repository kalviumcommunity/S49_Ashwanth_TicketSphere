import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import "./navbar.css"
import axios from 'axios'; 

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/">
        <b className="site-title">TicketSphere</b>
      </Link>
      <div className="nav-links">
        <Button
          variant="contained"
          className="login"
          style={{ width: '150px', color: 'black', backgroundColor: 'white' }}
        >
          <b>Login</b>
        </Button>
        <Button
          variant="contained"
          className="sell"
          style={{ width: '200px', color: 'white', backgroundColor: 'red' }}
        >
          <b>Sell your tickets!</b>
        </Button>       
      </div>
    </nav>
  );
}
