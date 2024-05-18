import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { Modal, Select } from 'antd';
import "./home.css";
import { SignedIn, useUser } from '@clerk/clerk-react';
import Loader from './loader.jsx'; // Import the Loader component

const Home = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state
  const [minLoadingTime, setMinLoadingTime] = useState(false); // Add min loading time state
  const { isSignedIn, user, isLoaded } = useUser();
  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tickets');
        setTickets(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchTickets();

    // Set a timeout to ensure loader shows for at least 2 seconds
    const timer = setTimeout(() => {
      setMinLoadingTime(true);
    }, 1500);

    return () => clearTimeout(timer); // Cleanup the timeout if component unmounts
  }, []);

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const filteredTickets = selectedCategory
    ? tickets.filter(ticket => ticket.category === selectedCategory)
    : tickets;

  if (loading || !isLoaded || !minLoadingTime) {
    return <Loader />; // Render Loader component while loading
  }

  return (
    <>
      <h4>‎ ‎ </h4>
      <div style={{ color: "black" }}>
        {isSignedIn && (
          <h3>Welcome back {user.fullName ? user.fullName : user.username}!</h3>
        )}
      </div>
      <h6>‎ ‎ </h6> 
      <img src="https://lordsuniversal.edu.in/wp-content/uploads/2018/08/aditya-chinchure-494048-unsplash.jpg" alt="" height="500px" width="1350px" />
      
      <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
        <Select
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          style={{ width: 200 }}
          placeholder="Select Category"
        >
          <Select.Option value="">All Categories</Select.Option>
          <Select.Option value="Sports">Sports</Select.Option>
          <Select.Option value="Concert">Concert</Select.Option>
          <Select.Option value="Party">Party</Select.Option>
          <Select.Option value="Standup">Standup</Select.Option>
          <Select.Option value="Movie Night">Movie Night</Select.Option>
          <Select.Option value="Game Night">Game Night</Select.Option>
          <Select.Option value="Food Festival">Food Festival</Select.Option>
        </Select>
      </div>
      <br />
      <motion.div 
        className="event-list"
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }} 
      >
        {filteredTickets.map((ticket, index) => (
          <motion.div
            key={ticket._id}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleOpenModal(ticket)}
          >
            <div className="card">
              <div className="card2">
                {ticket.poster && <img src={ticket.poster} alt={ticket.eventName} className="event-card-image" draggable={false} />}
                <div className="card-content">
                  <h3>{ticket.eventName}</h3>
                  <p>$ {ticket.price}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Modal
        title="Event Details"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Link to="/sell" key="sell">
            <Button variant="contained" color="secondary" onClick={handleCloseModal}>
              Sell your own ticket
            </Button>
          </Link>,
          <Link to={`/event/${selectedEvent._id}`} key="buy">
            <Button variant="contained" color="primary" onClick={handleCloseModal}>
              Buy
            </Button>
          </Link>,
        ]}
      >
        {selectedEvent && (
          <>
            <p>Event Name: {selectedEvent.eventName}</p>
            <p>Location: {selectedEvent.eventLocation}</p>
            <p>Category: {selectedEvent.category}</p>
            <p>Price: ${selectedEvent.price}</p>
            <p>Listed by: {user.fullName ? user.fullName : user.username}</p>
          </>
        )}
      </Modal>
    </>
  );
};

export default Home;
