import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './details.css';

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
    <div className="container">
      <div className="event-details">
        <img src={event.poster} alt={event.eventName} className="event-image" />
        <div className="event-info">
          <h2>{event.eventName}</h2>
          <p>Location: {event.eventLocation}</p>
          <p>Category: {event.category}</p>
          <p>Price: ${event.price}</p>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p className="description">Description: {event.description}</p>
          <p className="seller">Listed by: {event.sellerName}</p>
        </div>
      </div>
      {/* Add any additional content or buttons here */}
    </div>
  );
};

export default EventDetails;
