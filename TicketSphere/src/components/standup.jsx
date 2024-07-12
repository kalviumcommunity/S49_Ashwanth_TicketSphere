import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion'; 
import { Modal } from 'antd';
import Loader from './loader.jsx'; 
import "./events.css";

const Standup = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [minLoadingTime, setMinLoadingTime] = useState(false); 
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('https://ticketsphere.onrender.com/tickets');
        const standupTickets = response.data.filter(ticket => ticket.category === 'Standup');
        setTickets(standupTickets);
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

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading || !minLoadingTime) {
    return <Loader />; 
  }

  return (
    <>
      <h3>‎ ‎ </h3>
      <h3>‎ ‎ </h3>
      <h2><b>Standup</b></h2>
      <div className="event-list">
        {tickets.map((ticket, index) => (
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
      </div>

      <Modal
        title="Event Details"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={
          <div className="modal-footer">
            <a href={`/event/${selectedEvent._id}`} className="fancy buy-tickets-button">
              <span className="top-key"></span>
              <span className="text">Buy Tickets</span>
              <span className="bottom-key-1"></span>
              <span className="bottom-key-2"></span>
            </a>
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

      {showBackToTop && (
        <button className="back-top" onClick={handleBackToTop}>
          <svg className="svgIcon" viewBox="0 0 384 512">
            <path
              d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"
            ></path>
          </svg>
        </button>
      )}
      <br />
    </>
  );
};

export default Standup;
