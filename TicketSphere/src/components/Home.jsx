import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Modal, Select } from 'antd';
import "./Home.css";
import { SignedIn, useUser } from '@clerk/clerk-react';
import Loader from './loader.jsx';

const Home = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [minLoadingTime, setMinLoadingTime] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tickets');
        const shuffledTickets = response.data.sort(() => Math.random() - 0.5);
        setTickets(shuffledTickets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();

    const timer = setTimeout(() => {
      setMinLoadingTime(true);
    }, 1250);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const filteredTickets = selectedCategory
    ? tickets.filter(ticket => ticket.category === selectedCategory)
    : tickets;

  const displayedTickets = filteredTickets.slice(0, 6);

  if (loading || !isLoaded || !minLoadingTime) {
    return <Loader />;
  }


  return (
    <>
      <h4>‎ ‎ </h4>
      <div style={{ color: "black" }}>
        {isSignedIn && (
          <h3>Welcome back {user.fullName ? user.fullName : user.username}!</h3>
        )}
      </div>
      <h6>‎ ‎ </h6> 
      <img 
        src="https://lordsuniversal.edu.in/wp-content/uploads/2018/08/aditya-chinchure-494048-unsplash.jpg" 
        alt="Event" 
        className="responsive-img"
      />   
      <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}>
        <Link to="/events">
        <a href="#" class="button1">
  <span class="button1__icon-wrapper">
    <svg
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="button1__icon-svg"
      width="10"
    >
      <path
        d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
        fill="currentColor"
      ></path>
    </svg>

    <svg
      viewBox="0 0 14 15"
      fill="none"
      width="10"
      xmlns="http://www.w3.org/2000/svg"
      class="button1__icon-svg button1__icon-svg--copy"
    >
      <path
        d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
        fill="currentColor"
      ></path>
    </svg>
  </span>
  Explore All Events
</a>

</Link>
        
      </div>
      <b>Trending events 🔥</b>
      <br />
      <br />
      <motion.div
      className="event-list"
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {displayedTickets.map((ticket, index) => (
          <motion.div
            key={ticket._id}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleOpenModal(ticket)}
          >
            <div className="card">
              <div className="card2">
                {ticket.poster && <img src={ticket.poster} alt={ticket.eventName} className="event-card-image" draggable={false} />}
                <div className="card-content">
                  <h3>{ticket.eventName}</h3>
                  <p>₹ {ticket.price}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Modal
  title="Event Details"
  open={isModalVisible}
  onCancel={handleCloseModal}
  footer={
    <div className="modal-footer">
      <Link to={`/event/${selectedEvent._id}`} key="buy" className="fancy buy-tickets-button">
        <span className="top-key"></span>
        <span className="text">Buy Tickets</span>
        <span className="bottom-key-1"></span>
        <span className="bottom-key-2"></span>
      </Link>
    </div>
  }
  className="custom-modal"
>
  {selectedEvent && (
    <>
      <p>Event Name: {selectedEvent.eventName}</p>
      <p>Location: {selectedEvent.eventLocation}</p>
      <p>Category: {selectedEvent.category}</p>
      <p>Price: ₹{selectedEvent.price}</p>
      <p>Date: {new Date(selectedEvent.date).toLocaleDateString()}</p>
      <p>Listed by: {selectedEvent.sellerName}</p>
    </>
  )}
</Modal>

    </>
  );
};

export default Home;
