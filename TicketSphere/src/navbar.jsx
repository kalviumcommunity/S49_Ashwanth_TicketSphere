import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "./navbar.css";
import Signup from "./components/Signup"; // Import the Signup component

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        console.log("Opening modal"); // Debugging statement
        setOpen(true);
    };

    const handleClose = () => {
        console.log("Closing modal"); // Debugging statement
        setOpen(false);
    };

    return (
        <nav className="nav">
            <Link to="/">
                <img src="./logo/ticket2.png" alt="" />{" "}
                <b className="site-title">TicketSphere</b>
            </Link>
            <div className="nav-links">
                <Button
                    variant="contained"
                    className="login"
                    style={{ width: "150px", color: "black", backgroundColor: "white" }}
                    onClick={handleOpen}
                >
                    <b>Login</b>
                </Button>
                <Button
                    variant="contained"
                    className="sell"
                    style={{ width: "200px", color: "white", backgroundColor: "red" }}
                >
                    <b>Sell your tickets!</b>
                </Button>
                <Signup open={open} handleClose={handleClose} /> {/* Render the Signup component */}
            </div>
        </nav>
    );
}
