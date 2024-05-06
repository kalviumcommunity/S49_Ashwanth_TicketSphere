import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Modal, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openModal, setOpenModal] = useState(false);

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
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <h4>‎ ‎ </h4>
      <img src="https://lordsuniversal.edu.in/wp-content/uploads/2018/08/aditya-chinchure-494048-unsplash.jpg" alt="" height="500px" width="1350px" />
      <div
        className="event-list"
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
      >
        {tickets.map((ticket, index) => (
          <motion.div 
            key={ticket._id} 
            onClick={() => handleOpenModal(ticket)}
            drag // Enable drag functionality
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Optional: Set constraints for dragging
            style={{ cursor: 'grab' }} // Optional: Change cursor style
          >
            <Card sx={{ maxWidth: 345, margin: '10px' }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {ticket.eventName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {ticket.eventLocation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {ticket.category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  $ {ticket.price}
                </Typography>
                <img src={ticket.poster} alt={ticket.eventName} style={{ maxWidth: '100%', height: 'auto' }} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="event-details-modal"
        aria-describedby="event-details"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: '10px',
          }}
        >
          <h2 id="event-details-modal">Event Details</h2>
          {selectedEvent && (
            <>
              <p>Event Name: {selectedEvent.eventName}</p>
              <p>Location: {selectedEvent.eventLocation}</p>
              <p>Category: {selectedEvent.category}</p>
              <p>Price: ${selectedEvent.price}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/sell" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="secondary">
                    Sell your own ticket
                  </Button>
                </Link>
                <Link to="/buy" style={{ textDecoration: 'none' }}>
                  <Button variant="contained" color="primary">
                    Buy
                  </Button>
                </Link>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Home;
