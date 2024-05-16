import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const handleEdit = (ticketId) => {
    // Implement edit functionality
    console.log('Edit ticket:', ticketId);
  };

  const handleDelete = async (ticketId) => {
    try {
      await axios.delete(`http://localhost:3000/tickets/${ticketId}`);
      setTickets(tickets.filter(ticket => ticket._id !== ticketId));
      console.log('Ticket deleted successfully:', ticketId);
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  return (
    <div>
      <h2>Your Tickets</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket._id}>
            <p>{ticket.eventName}</p>
            <p>{ticket.eventLocation}</p>
            <p>${ticket.price}</p>
            <Button onClick={() => handleEdit(ticket._id)}>Edit</Button>
            <Button onClick={() => handleDelete(ticket._id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
