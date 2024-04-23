import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "./navbar.css";
import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Navbar() {
    const handleAfterSignOut = () => {
        window.location.href = "/"; 
    };


    return (
        <nav className="nav">
            <Link to="/">
                <img src="./logo/ticket2.png" alt="" />{" "}
                <b className="site-title">TicketSphere</b>
            </Link>
            <div className="nav-links">
                <SignedOut>
                    <Button
                        variant="contained"
                        className="login"
                        style={{ width: "150px", color: "black", backgroundColor: "white" }}
                        component={Link}
                        to="/sign-in"
                    >
                        <b>Login</b>
                    </Button>
                </SignedOut>
                <Button
                    variant="contained"
                    className="sell"
                    style={{ width: "200px", color: "white", backgroundColor: "red" }}
                    component={Link}
                    to="/sellpage"
                >
                    <b>Request an event!</b>
                </Button>
                <UserButton afterSignOut={handleAfterSignOut} />
            </div>
        </nav>
    );
}
