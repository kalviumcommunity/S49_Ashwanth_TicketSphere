import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import App from './App.jsx';
import './index.css';
import {NextUIProvider} from "@nextui-org/react";
import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, SignedIn, SignedOut,Protect } from "@clerk/clerk-react";
import SellPage from './components/SellPage.jsx';
import ClerkWithRoutes from './Clerk.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
    <BrowserRouter>
        
        <ClerkWithRoutes />
    </BrowserRouter>
    </NextUIProvider>
  </React.StrictMode>,
);