import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Info = () => {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    if (!eventId) { 
      setError('Event ID not found');
      setLoading(false);
      return; 
    }

    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tickets/${eventId}`);
        setEventDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError(error); 
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  console.log('Event ID:', eventId);
  console.log('Loading:', loading);
  console.log('Error:', error);

  return (
    <div>
      {error ? (
        <p>Error: {error.message}</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Event Details</h2>
          <p>Event ID: {eventId}</p>
          {eventDetails && (
            <>
              <p>Event Name: {eventDetails.eventName}</p>
              <p>Location: {eventDetails.eventLocation}</p>
              <p>Price: {eventDetails.price}</p>
              
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Info;
