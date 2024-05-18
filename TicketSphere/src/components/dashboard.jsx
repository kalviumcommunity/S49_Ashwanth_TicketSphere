import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Card } from 'antd';
import "./dashboard.css"
const { Meta } = Card;

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const { user, isLoaded } = useUser();

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

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const userTickets = tickets.filter(ticket =>
    ticket.sellerName === (user.fullName || user.username)
  );

  return (
    <>
    <h1>Your events</h1>
    <h4>Manage all your listed events on this page </h4>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
      {userTickets.length > 0 ? (
        userTickets.map((ticket) => (
          <Card
            key={ticket._id}
            hoverable
            style={{ width: 275 , height : 325 }}
            cover={ticket.poster ? <img alt={ticket.eventName} src={ticket.poster} height = "150px" /> : null}
          >
            <Meta
              title={ticket.eventName}
              description={`Location: ${ticket.eventLocation}, Price: $${ticket.price}, Category: ${ticket.category}`}
            />
          </Card>
        ))
      ) : (
        <p>You have not listed any tickets yet.</p>
      )}
    </div>
    </>
  );
};

export default Dashboard;
