import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Card, Button, Modal, Form, Input, message } from 'antd';
import "./dashboard.css";
const { Meta } = Card;
import Loader from './loader.jsx';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
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

    fetchTickets();
    setTimeout(() => {
      setIsLoading(false);
    }, 1250);
  }, []);

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
      <h4>All your listed tickets show up here</h4>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {userTickets.length > 0 ? (
          userTickets.map((ticket) => (
            <Card
              key={ticket._id}
              hoverable
              style={{ width: 275, height: 325 }}
              cover={ticket.poster ? <img alt={ticket.eventName} src={ticket.poster} height="150px" /> : null}
              actions={[
                <Button onClick={() => handleEdit(ticket._id)} type="primary">Edit</Button>,
                <Button onClick={() => showDeleteModal(ticket._id)} type="danger">Delete</Button>,
              ]}
            >
              <Meta
                title={ticket.eventName}
                description={`Location: ${ticket.eventLocation}, Price: $${ticket.price}, Category: ${ticket.category}`}
              />
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
          <p>Are you sure you want to unlist this ticket?</p>
        </Modal>
      </div>
    </>
  );
};

export default Dashboard;
