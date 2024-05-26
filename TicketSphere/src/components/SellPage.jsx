import React, { useState } from 'react';
import "./Sell.css"; 
import axios from "axios";
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material'; // Import TextField from MUI
import { DatePicker } from 'antd'; // Import DatePicker from Ant Design
// import '@mui/icons-material/Event';
import { useUser } from "@clerk/clerk-react";

export default function SellPage() {
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState(""); 
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null); // State for date
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number
  const { user } = useUser();
  const eventTypes = ['Sports', 'Concert', 'Party', 'Standup', 'Movie Night', 'Game Night', 'Food Festival'];

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleUpload = async (e) => {
    e.preventDefault();
  
    // Convert date to ISO string and extract only the date part
    const formattedDate = date ? date.toISOString().split('T')[0] : null;
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('eventName', eventName);
    formData.append('eventLocation', eventLocation);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('sellerName', user.fullName ? user.fullName : user.username); 
    formData.append('description', description);
    formData.append('date', formattedDate);
    formData.append('phoneNumber', phoneNumber); // Add phone number to form data
  
    try {
      const response = await axios.post('http://localhost:3000/sell', formData);
      console.log(response);
      toast.success("Event listed Successfully!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error("Please enter all the required details", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
      });
    }
  };

  return (
    <>
      <div className="back">
        
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
          <div className="input-group">
            <label htmlFor="description">Event Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <MenuItem value="">Select Event Type</MenuItem>
                {eventTypes.map((type, index) => (
                  <MenuItem key={index} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="input-group">
            <label>Date:</label>
            <DatePicker 
              value={date}
              onChange={value => setDate(value)}
              format="DD/MM/YYYY"
            />
          </div>
          <div className="input-group">
            <TextField
              id="phoneNumber"
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
              inputProps={{ pattern: "[0-9]*" }}
              fullWidth
              required
            />
          </div>
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} />
            {file && (
              <div className="preview-container">  
                <img src={URL.createObjectURL(file)} alt="Event Poster Preview" style={{ width: "200px", height: "200px" }} />
              </div>
            )}
            {!file && (
              <p>Drag & drop or click to select an event poster</p>
            )}
          </div>
          <button type="submit">Sell Ticket</button>
        </form>
      </div>
    </>
  );
}
