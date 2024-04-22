import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Info = () => {
    const { eventId } = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/tickets/${eventId}`);
                console.log('Response:', response.data); 
                setEventDetails(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching event details:', error);
            }
        };

        fetchEventDetails();
    }, [eventId]);

    console.log('Event ID:', eventId); // Log the event ID
    console.log('Loading:', loading); // Log the loading state

    return (
        <div>
            {loading ? (
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
                            {/* Add more fields as needed */}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Info;
