import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Modal, Button, Box } from '@mui/material';
import './home.css';

const Home = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:3000/tickets'); // Adjust URL if needed
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
            <div className="event-list">
                {tickets.map(ticket => (
                    <div key={ticket._id} onClick={() => handleOpenModal(ticket)}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {ticket.eventName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Location: {ticket.eventLocation}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    $ {ticket.price}
                                </Typography>
                                <img src={ticket.poster} alt={ticket.eventName} style={{ maxWidth: '100%', height: 'auto' }} />
                            </CardContent>
                        </Card>
                    </div>
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
                    }}
                >
                    <h2 id="event-details-modal">Event Details</h2>
                    {selectedEvent && (
                        <>
                            <p>Event Name: {selectedEvent.eventName}</p>
                            <p>Location: {selectedEvent.eventLocation}</p>
                            <p>Price: {selectedEvent.price}</p>
                            {/* Add more fields as needed */}
                        </>
                    )}
                    <Button onClick={handleCloseModal}>Close</Button>
                </Box>
            </Modal>
        </>
    );
};

export default Home;
