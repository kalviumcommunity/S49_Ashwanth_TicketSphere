import React, { useEffect } from "react";
import Modal from "@mui/material/Modal";
import { jwtDecode } from "jwt-decode";

export default function Signup({ open, handleClose }) {
    const responseGoogle = (response) => {
        try {
            console.log(response.credential);
            const token = response.credential;
            const userObject = jwtDecode(token);
            console.log(userObject);
        } catch (error) {
            console.error('Error decoding JWT token:', error);
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.onload = () => {
            google.accounts.id.initialize({
                client_id: "630265155367-a6p3n7g8cjif4l247lakjjqsjsu9s2m3.apps.googleusercontent.com",
                callback: responseGoogle
            });

            // Render the button after initialization
            const signInDiv = document.getElementById("signInDiv");
            if (signInDiv) {
                google.accounts.id.renderButton(
                    signInDiv,
                    { "theme": "outline", "size": "large" }
                );
            } else {
                console.error('Element with id "signInDiv" not found.');
            }
        };
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div id="signInDiv"></div>
        
    );
}
