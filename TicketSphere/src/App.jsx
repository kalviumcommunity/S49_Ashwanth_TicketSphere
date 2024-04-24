import React from 'react';
import { Route, Routes } from "react-router-dom";
import Navbar from './navbar'; 
import "./App.css"
import SellPage from './components/SellPage';
import Home from './components/Home';
import Dashboard from './components/dashboard';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path = "/" element = {<Home/>} />
        <Route path="/sellpage" element={<SellPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
)}
export default App;
