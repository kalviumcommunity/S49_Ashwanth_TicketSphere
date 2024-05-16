import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tickets/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [id]);

  return (
    <div>
      {event ? (
        <>
          <h2>{event.eventName}</h2>
          <p>Location: {event.eventLocation}</p>
          <p>Category: {event.category}</p>
          <p>Price: ${event.price}</p>
          {/* Add any other event details you want to display */}
        </>
      ) : (
        <p>Loading event details...</p>
      )}
    </div>
  );
};

export default EventDetails;