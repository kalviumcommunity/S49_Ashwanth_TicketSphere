import React from "react";
import { Link } from "react-router-dom";
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
                {/* <span class="title" data-text="Awesome">
                    <span class="actual-text">TicketSphere</span>
                    <span aria-hidden="true" class="hover-text">TicketSphere</span>
                </span> */}
            </Link>
            <div className="nav-links">
                <SignedOut>
                <Link to="/sign-in" className="comic-button">
                    <b>Login</b>
                </Link>
                </SignedOut>
                <SignedIn>
                <Link to="/dashboard" className="comic-button">
                    <b>Dashboard</b>
                </Link>
                </SignedIn>
                <Link to="/sellpage" className="comic-button">
                    <b>Sell your Ticket!</b>
                </Link>

                <UserButton afterSignOut={handleAfterSignOut} />


            </div>
        </nav>
    );
}
