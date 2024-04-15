import React from 'react';
import { Route, Routes } from "react-router-dom";
import Navbar from './navbar'; 
import "./App.css"
import SellPage from './components/SellPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/sellpage" element={<SellPage />} />
      </Routes>
    </>
)}
export default App;
