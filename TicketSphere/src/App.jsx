import React from 'react';
import { Route, Routes } from "react-router-dom";
import Navbar from './navbar'; 
import "./App.css"
import "./index.css"
import SellPage from './components/SellPage';
import Home from './components/Home';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path = "/" element = {<Home/>} />
        <Route path="/sellpage" element={<SellPage />} />
      </Routes>
    </>
)}
export default App;
