import React, { useState } from 'react';
import './Sell.css';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'lottie-react';
import animationData from '../lottie/Sellpage_anim.json';
import { useUser } from '@clerk/clerk-react';
import { DatePicker, Input, Upload } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etkeoqwiiudcgbfocxjj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0a2VvcXdpaXVkY2diZm9jeGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzOTQxMjQsImV4cCI6MjAzOTk3MDEyNH0.TlnKIzRFxa8bQivcTc1nB-rwXnsolnG4_ZXSgAvkl6Q';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SellPage() {
  const [eventName, setEventName] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useUser();
  const eventTypes = [
    'Sports',
    'Concert',
    'Party',
    'Standup',
    'Movie Night',
    'Game Night',
  ];
  const [quantity, setQuantity] = useState(1);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      const previewURL = URL.createObjectURL(acceptedFiles[0]);
      setImagePreview(previewURL);
    },
  });

  const handleUpload = async (e) => {
    e.preventDefault();
  
    if (!file) {
      toast.error('Please select an image to upload.');
      return;
    }
  
    const formattedDate = date ? date.toISOString().split('T')[0] : null;
  
    try {

      const { data, error } = await supabase.storage
        .from('Posters')
        .upload(`public/${Date.now()}_${file.name}`, file);
  
      if (error) {
        throw error;
      }

      const { data: urlInfo } = supabase.storage.from('Posters').getPublicUrl(data.path);
  
      if (!urlInfo) {
        throw new Error('Failed to get image URL');
      }
      
      const imageUrl = urlInfo.publicUrl;
  
      const eventData = {
        eventName,
        eventLocation,
        price,
        category,
        sellerName: user.fullName ? user.fullName : user.username,
        description,
        date: formattedDate,
        phoneNumber,
        quantity,
        poster: imageUrl, 
      };
  
      const response = await axios.post('https://ticketsphere.onrender.com/sell', eventData);
  
      console.log(response);
      toast.success('Event listed successfully!', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
      });
  
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image or event details.', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
      });
    }
  };
  const handleImageDelete = () => {
    setFile(null);
    setImagePreview(null);
  };

  return (
    <>
      <h3>‎ ‎ </h3>
      <div className="back">
        <div className="animation-container">
          <Lottie animationData={animationData} autoplay loop />
        </div>
        ‎ ‎ ‎ ‎ ‎ ‎ ‎
      </div>
      <div className="sell-form">
        <ToastContainer />
        <form onSubmit={handleUpload}>
          <div className="input-row">
            <div className="input-group">
              <div className="brutalist-container">
                <Input
                  placeholder="Event Name"
                  className="brutalist-input smooth-type"
                  type="text"
                  id="eventName"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                />
                <label className="brutalist-label">Event Name</label>
              </div>
            </div>

            <div className="input-group">
              <div className="brutalist-container">
                <Input
                  placeholder="Event Location"
                  className="brutalist-input smooth-type"
                  type="text"
                  id="eventLocation"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  required
                  suffix={<EnvironmentOutlined />}
                />
                <label className="brutalist-label">Event Location</label>
              </div>
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <div className="brutalist-container">
                <Input
                  placeholder="Price"
                  className="brutalist-input smooth-type"
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min="0"
                  required
                />
                <label className="brutalist-label">Price</label>
              </div>
            </div>
            <div className="input-group">
              <div className="brutalist-container">
                <Input
                  placeholder="Quantity"
                  className="brutalist-input smooth-type"
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                  required
                />
                <label className="brutalist-label">Quantity</label>
              </div>
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <div className="brutalist-container">
                <DatePicker
                  placeholder="Select Date"
                  className="brutalist-input smooth-type"
                  value={date}
                  onChange={(date) => setDate(date)}
                  style={{ width: '100%' }}
                  required
                />
                <label className="brutalist-label">Event Date</label>
              </div>
            </div>
            <div className="input-group">
              <div className="brutalist-container">
                <select
                  className="brutalist-input smooth-type"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select Event Type
                  </option>
                  {eventTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <label className="brutalist-label">Category</label>
              </div>
            </div>
          </div>
          <div className="input-group description-group">
            <div className="brutalist-container">
              <Input.TextArea
                placeholder="Please provide a brief description of the event. Also include details about the location of the event."
                className="brutalist-input smooth-type"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <label className="brutalist-label">Event Description</label>
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <div className="brutalist-container">
                <Input
                  placeholder="Phone Number"
                  className="brutalist-input smooth-type"
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  pattern="[0-9]*"
                  required
                />
                <label className="brutalist-label">Phone Number</label>
              </div>
            </div>
            <div className="input-group">
              <Upload.Dragger {...getRootProps()}>
                <p className="ant-upload-drag-icon"></p>
                <p className="ant-upload-text">
                  Drag & drop or click to select an event poster
                </p>
                <input {...getInputProps()} />
              </Upload.Dragger>
              {imagePreview && (
                <div className="image-preview-container">
                  <span className="delete-icon" onClick={handleImageDelete}>
                    &#10006;
                  </span>
                  <img
                    src={imagePreview}
                    alt="Event Poster Preview"
                    className="image-preview"
                  />
                </div>
              )}
            </div>
          </div>
          <button className="card__button" type="submit">Sell Ticket</button>
        </form>
        <br />
      </div>
    </>
  );
}
