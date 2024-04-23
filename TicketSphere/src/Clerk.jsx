import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, useNavigate } from "react-router-dom";
import App from './App.jsx';
import './index.css';
import {NextUIProvider} from "@nextui-org/react";
import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, SignedIn, SignedOut,Protect } from "@clerk/clerk-react";
import SellPage from './components/SellPage.jsx';
import {neobrutalism} from "@clerk/themes";
import Info from "./components/Info.jsx"

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
export  default function ClerkWithRoutes(){
    const navigate = useNavigate()
  
    return(
      <ClerkProvider
      appearance={{
        baseTheme: neobrutalism
      }}
        publishableKey ="pk_test_c3dlZXBpbmctcHVtYS02OS5jbGVyay5hY2NvdW50cy5kZXYk"
        navigate={(to) => navigate(to)}
      >
        <Routes>
        <Route path="/" element={<App />} />
  
        <Route
            path="/sign-in/"
            element={<SignIn routing="path" path="/sign-in" />}
          />
          <Route
            path="/sign-up/*"
            element={<SignUp routing="path" path="/sign-up" />}
          />
  
          <Route
            path="/sellpage"
            element={
              <>
              <SignedIn>
                <SellPage />
              </SignedIn>
               <SignedOut>
                <RedirectToSignIn />
             </SignedOut>
              </>
            }
          />    
          <Route
            path = "/info/:id"
            element={<Info />}
          />
        </Routes>
        
  
      </ClerkProvider>
  
    )
  }