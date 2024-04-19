import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';
import './home.css';

const Home = () => {
    const [tickets, setTickets] = useState([]);

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

    return (
        <>
            <h4>‎ ‎ </h4>
            <img src="https://lordsuniversal.edu.in/wp-content/uploads/2018/08/aditya-chinchure-494048-unsplash.jpg" alt="" height="500px" width="1350px" />
            <div className="event-list">
                {tickets.map(ticket => (
                    <Card key={ticket._id} sx={{ maxWidth: 345 }}>
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
                ))}
            </div>
        </>
    );
};

export default Home;
