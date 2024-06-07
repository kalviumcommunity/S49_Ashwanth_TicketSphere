import React, { useState } from 'react';
import "./Sell.css"; 
import axios from "axios";
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { Select, DatePicker, Input, Button, Upload, message } from 'antd';
import Lottie from 'lottie-react'; 
import animationData from "../lottie/sellpage_ani.json"
import { useUser } from "@clerk/clerk-react";

const { Option } = Select;

export default function SellPage() {
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState(""); 
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useUser();
  const eventTypes = ['Sports', 'Concert', 'Party', 'Standup', 'Movie Night', 'Game Night', 'Food Festival'];
  const [quantity, setQuantity] = useState(1);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]);
      const previewURL = URL.createObjectURL(acceptedFiles[0]);
      setImagePreview(previewURL);
    },
  });

  const handleUpload = async (e) => {
    e.preventDefault();

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
    formData.append('phoneNumber', phoneNumber);
    formData.append('quantity', quantity);
  
    try {
      const response = await axios.post('http://localhost:3000/sell', formData);
      console.log(response);
      toast.success("Event listed Successfully!", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
      });
      setTimeout(() => {
        window.location.href = "/dashboard";
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
      <div className="animation-container">
        <Lottie animationData={animationData} autoplay loop />
      </div>
      ‎ ‎ 
      ‎ ‎
      ‎ ‎
      </div>
      <div className="sell-form"> 
        <ToastContainer /> 
        <form onSubmit={handleUpload}>
          <div className="input-group">
            <label htmlFor="eventName">Event Name:</label>
            <Input
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="eventLocation">Event Location:</label>
            <Input
              id="eventLocation"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="price">Price:</label>
            <Input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))} 
              min="0"
              required
            />
          </div>
          <div className="input-group">
  <label htmlFor="quantity">Quantity:</label>
  <Input
    type="number"
    id="quantity"
    value={quantity}
    onChange={(e) => setQuantity(Number(e.target.value))}
    min="1"
    required
  />
</div>
          <div className="input-group">
            <label htmlFor="description">Event Description:</label>
            <Input.TextArea
              id="description"
              value={description}
              placeholder='Please provide a brief description of the event. If u have multiple tickets, mention it here'
              onChange={(e) => setDescription(e.target.value)}
              required 
            />
          </div>
          <Select
  placeholder="Select Event Type"
  value={category}
  onChange={(value) => setCategory(value)}
  style={{ minWidth: 200 }}
  required
>Category
  {eventTypes.map((type, index) => (
    <Option key={index} value={type}>{type}</Option>
  ))}
</Select>
          <div className="input-group">
            <label>Date:</label>
            <DatePicker 
              value={date}
              onChange={value => setDate(value)}
              format="DD/MM/YYYY"
            />
          </div>
          <div className="input-group">
            <Input
              id="phoneNumber"
              placeholder="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
              pattern="[0-9]*"
              required
            />
          </div>
          <div className="input-group">
            <Upload.Dragger {...getRootProps()}>
              <p className="ant-upload-drag-icon"></p>
              <p className="ant-upload-text">Drag & drop or click to select an event poster</p>
            </Upload.Dragger>
            {imagePreview && <img src={imagePreview} alt="Event Poster Preview" className="image-preview" />}
          </div>

          <Button type="primary" htmlType="submit">Sell Ticket</Button>
        </form>
        
        
      </div>
    </>
  );
}
