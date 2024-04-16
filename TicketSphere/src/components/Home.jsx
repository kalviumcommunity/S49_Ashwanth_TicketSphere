import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Home.css"
import {Card, CardBody, CardFooter, Image} from "@nextui-org/react";

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
        <img src="https://lordsuniversal.edu.in/wp-content/uploads/2018/08/aditya-chinchure-494048-unsplash.jpg" alt="" height= "500px" width= "1350px" />
        <div>
        <br />
            <ul>
                {tickets.map(ticket => (
                    <li key={ticket._id}>
                        <Card>
                            <CardBody>
                                <h2>{ticket.eventName}</h2>
                                <p>Location: {ticket.eventLocation}</p>
                                <p>Price: {ticket.price}</p>
                            </CardBody>
                            <CardFooter>
                                {/* Add any actions here */}
                            </CardFooter>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
        </>
        
    );
};

export default Home;