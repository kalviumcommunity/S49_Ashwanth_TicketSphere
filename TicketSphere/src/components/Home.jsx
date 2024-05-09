import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; 
import { Modal, Select } from 'antd';
import "./home.css";

const Home = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
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

  return (
    <>
      <h4>‎ ‎ </h4>
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
            onClick={() => handleOpenModal(ticket)}
            drag 
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} 
            style={{ cursor: 'grab' }} 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: index * 0.1 }} 
          >
            <div class="card">
              <div class="card2">
                <div class="card-content">
                  <br />
                  <h3>{ticket.eventName}</h3>
                  <p>Category: {ticket.category}</p>
                  <p>$ {ticket.price}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Modal
        title="Event Details"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Link to="/sell" key="sell">
            <Button variant="contained" color="secondary" onClick={handleCloseModal}>
              Sell your own ticket
            </Button>
          </Link>,
          <Link to="/buy" key="buy">
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
          </>
        )}
      </Modal>
    </>
  );
};

export default Home;
