import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tickets/${id}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{event.eventName}</h1>
      <p>Location: {event.eventLocation}</p>
      <p>Category: {event.category}</p>
      <p>Price: ${event.price}</p>
      <p>Description: {event.description}</p>
      <p>Listed by: {event.sellerName}</p>
    </div>
  );
};

export default EventDetails;
