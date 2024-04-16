import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "./navbar.css";
import { UserButton } from "@clerk/clerk-react"

export default function Navbar() {
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
                    component={Link}
                    to="/sign-in"
                >
                    <b>Login</b>
                </Button>
                <Button
                    variant="contained"
                    className="sell"
                    style={{ width: "200px", color: "white", backgroundColor: "red" }}
                    component={Link}
                    to="/sellpage"
                >
                    <b>Sell your tickets!</b>
                </Button>
                <UserButton />
            </div>
        </nav>
    );
}
