import React, { useState } from "react";
import "./Sell.css"; 
import axios from "axios";
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { UserButton } from "@clerk/clerk-react"

export default function SellPage() {
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [file, setFile] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]); 
    },
  });

  const handleUpload = async (e) => {
    e.preventDefault(); 

    
    const formData = new FormData();
    formData.append('file', file); 
    formData.append('eventName', eventName); 
    formData.append('eventLocation', eventLocation); 
    formData.append('price', price); 

    try {
      const response = await axios.post('http://localhost:3000/sell', formData);
      console.log(response);
      toast.success("Event Listed Successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error Listing Event!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
  };

  return (
    
    <>
    <div>
        
    </div>
    <div className="sell-form"> 
      <ToastContainer /> 
      <form onSubmit={handleUpload}>
        <div className="input-group">
          <label htmlFor="eventName">Event Name:</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="eventLocation">Event Location:</label>
          <input
            type="text"
            id="eventLocation"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))} 
            min="0"
            required
          />
        </div>
        <div className="dropzone" {...getRootProps()}>
          <input {...getInputProps()} />
          {file ? (
            <p>Uploaded: {file.name}</p>
          ) : (
            <p>Drag & drop or click to select an event poster</p>
          )}
        </div>
        <button type="submit">Sell Ticket</button>
      </form>
    </div>
          <a href="/">Go Home</a>
    </>
      );
}
