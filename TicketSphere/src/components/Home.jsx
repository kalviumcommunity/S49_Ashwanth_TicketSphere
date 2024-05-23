import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Modal, Select } from 'antd';
import "./home.css";
import { SignedIn, useUser } from '@clerk/clerk-react';
import Loader from './loader.jsx';

const Home = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tickets');
        const shuffledTickets = response.data.sort(() => Math.random() - 0.5);
        setTickets(shuffledTickets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();

    const timer = setTimeout(() => {
      setMinLoadingTime(true);
    }, 1250);

    return () => clearTimeout(timer);
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

  const displayedTickets = filteredTickets.slice(0, 6);

  if (loading || !isLoaded || !minLoadingTime) {
    return <Loader />;
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
      <img 
        src="https://lordsuniversal.edu.in/wp-content/uploads/2018/08/aditya-chinchure-494048-unsplash.jpg" 
        alt="Event" 
        className="responsive-img"
      />   
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <Link to="/events">
          <button className='vav'>
    <span>View all events</span>
    <svg width="34" height="34" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="37" cy="37" r="35.5" stroke="black" stroke-width="3"></circle>
        <path d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z" fill="black"></path>
    </svg>
</button>
        </Link>
      </div>
      <br />
      <motion.div
      className="event-list"
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {displayedTickets.map((ticket, index) => (
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
            <p>Listed by: {selectedEvent.sellerName}</p>
          </>
        )}
      </Modal>
    </>
  );
};

export default Home;
