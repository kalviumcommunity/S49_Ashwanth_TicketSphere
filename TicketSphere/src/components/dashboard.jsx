import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Card, Button, Modal, Form, Input, message, Alert } from 'antd';
import "./dashboard.css";
const { Meta } = Card;
import Loader from './loader.jsx';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [boughtTickets, setBoughtTickets] = useState([]); 
  const { user, isLoaded } = useUser();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); 
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editTicketData, setEditTicketData] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    const fetchBoughtTickets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/buys', {
          params: { buyerName: user.fullName || user.username }
        });
        setBoughtTickets(response.data);
      } catch (error) {
        console.error('Error fetching bought tickets:', error);
      }
    };

    fetchTickets();
    fetchBoughtTickets();
    setTimeout(() => {
      setIsLoading(false);
    }, 1250);
  }, [user]);

  const showEditModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsEditModalVisible(true);
  };

  const handleEdit = (ticketId) => {
    const ticketToEdit = tickets.find(ticket => ticket._id === ticketId);
    setEditTicketData(ticketToEdit);
    showEditModal(ticketId);
  };

  const handleEditSubmit = async (editedValues) => {
    try {
      await axios.put(`http://localhost:3000/tickets/${selectedTicketId}`, editedValues);
      message.success('Ticket updated successfully');
      setIsEditModalVisible(false);
      const response = await axios.get('http://localhost:3000/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error updating ticket:', error);
      message.error('Failed to update ticket');
    }
  };

  const showDeleteModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/tickets/${selectedTicketId}`);
      message.success('Ticket unlisted successfully');
      setIsDeleteModalVisible(false);
      const response = await axios.get('http://localhost:3000/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error deleting ticket:', error);
      message.error('Failed to unlist ticket');
    }
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    setIsDeleteModalVisible(false);
  };

  if (!isLoaded || isLoading) {
    return <Loader />;
  }

  const userTickets = tickets.filter(ticket =>
    ticket.sellerName === (user.fullName || user.username)
  );

  return (
    <>
      <h4>‎ ‎ </h4>
      <h1>Your events</h1>
      <h4>All your listed and bought tickets show up here</h4>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between' }}>
        {userTickets.length > 0 ? (
          userTickets.map((ticket) => (
            <Card
              key={ticket._id}
              hoverable
              style={{ width: 350, height: 350 }}
              cover={ticket.poster ? <img alt={ticket.eventName} src={ticket.poster} height="180px" /> : null}
            >
              <Meta
                title={ticket.eventName}
                description={`Location: ${ticket.eventLocation}, Price: ₹ ${ticket.price}, Category: ${ticket.category}, Remaining Quantity: ${ticket.quantity}`}
              />
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => handleEdit(ticket._id)} type="primary">Edit</Button>
                <Button onClick={() => showDeleteModal(ticket._id)} type="danger">Delete</Button>
                <Link to={`/event/${ticket._id}`} target="_blank" rel="noopener noreferrer"><Button type="default">View Listing</Button></Link>
              </div>
            </Card>
          ))
        ) : (
          <p>You have not listed any tickets yet🥲</p>
        )}

        <Modal
          title="Edit Ticket"
          open={isEditModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            initialValues={editTicketData}
            onFinish={handleEditSubmit}
          >
            <Form.Item name="eventName" label="Event Name">
              <Input />
            </Form.Item>
            <Form.Item name="eventLocation" label="Location">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="quantity" label="Quantity">
              <Input type="number" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
              <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Confirm Delete"
          open={isDeleteModalVisible}
          onOk={handleDelete}
          onCancel={handleCancel}
          okText="Delete"
          cancelText="Cancel"
        >
          <Alert message="Are you sure you want to unlist this ticket?" type="warning" />
        </Modal>
      </div>

      <h1>Bought Tickets</h1>
      <h4>All tickets you have bought show up here</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between' }}>
        {boughtTickets.length > 0 ? (
  boughtTickets
    .filter(ticket => ticket.buyerName === (user.fullName || user.username))
    .map((ticket) => (
      <Card
        key={ticket._id}
        hoverable
        style={{ width: 350, height: 350 }}
        cover={ticket.poster ? <img alt={ticket.eventName} src={ticket.poster} height="180px" /> : null}
      >
        <Meta
          title={ticket.eventName}
          description={`Location: ${ticket.eventLocation}, Price: ₹ ${ticket.price}, Category: ${ticket.category}, Quantity: ${ticket.quantity}`}
        />
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Link to={`/event/${ticket._id}`} target="_blank" rel="noopener noreferrer"><Button type="default">View Listing</Button></Link>
        </div>
      </Card>
    ))
) : (
  <p>You have not bought any tickets yet🥲</p>
)}

      </div>
    </>
  );
};

export default Dashboard;
