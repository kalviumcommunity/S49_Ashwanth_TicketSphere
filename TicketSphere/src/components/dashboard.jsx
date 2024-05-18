import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Card, Button ,Modal, message} from 'antd';
import "./dashboard.css"
const { Meta } = Card;

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const { user, isLoaded } = useUser();
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };
    const showModal = (ticketId) => {
      setSelectedTicketId(ticketId);
      setIsModalVisible(true);
    };
  
    fetchTickets();
  }, []);
  const handleDelete = async () => {
    try {
      // Send DELETE request to delete the ticket
      await axios.delete(`http://localhost:3000/tickets/${selectedTicketId}`);
      
      // Show success toast notification
      message.success('Ticket unlisted successfully');

      // Close the confirmation modal
      setIsModalVisible(false);
      
      // Reload the page or update the ticket list
      // Add logic here to refresh the ticket list if needed
    } catch (error) {
      console.error('Error deleting ticket:', error);
      // Show error toast notification
      message.error('Failed to unlist ticket');
    }
  };

  // Function to handle cancellation of ticket deletion
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const userTickets = tickets.filter(ticket =>
    ticket.sellerName === (user.fullName || user.username)
  );

  return (
    <>
    <h4>‎ ‎ </h4>
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
            actions={[
              <Button onClick={() => handleEdit(ticket._id)} type="primary">Edit</Button>,
              <Button onClick={() => handleDelete(ticket._id)} type="danger">Delete</Button>,
            ]}
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


<Modal
        title="Confirm Delete"
        open={isModalVisible}
        onOk={handleDelete} // Call handleDelete when OK button is clicked
        onCancel={handleCancel} // Call handleCancel when Cancel button is clicked or modal is closed
        okText="Delete" // Customize OK button text
        cancelText="Cancel" // Customize Cancel button text
      >
        <p>Are you sure you want to unlist this ticket?</p>
      </Modal>
    </div>
    </>
  );
};

export default Dashboard;
