import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Card, Button, Modal, Form, Input, message, Alert, Badge, Divider } from 'antd';
import Loader from './loader.jsx';
import "./dashboard.css"
import { Link } from 'react-router-dom';
import { LineChartOutlined, ClockCircleFilled } from '@ant-design/icons';

const { Meta } = Card;

const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const [tickets, setTickets] = useState([]);
  const [boughtTickets, setBoughtTickets] = useState([]);
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
      } finally {
        setIsLoading(false);
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

    if (isLoaded) {
      fetchTickets();
      fetchBoughtTickets();
    }
  }, [user, isLoaded]);

  const showEditModal = (ticketId) => {
    const ticketToEdit = tickets.find(ticket => ticket._id === ticketId);
    if (ticketToEdit) {
      setEditTicketData(ticketToEdit);
      setSelectedTicketId(ticketId);
      setIsEditModalVisible(true);
    }
  };

  const handleEdit = async (ticketId, editedValues) => {
    try {
      await axios.put(`http://localhost:3000/tickets/${ticketId}`, editedValues);
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

  const userTickets = tickets.filter(ticket =>
    ticket.sellerName === (user.fullName || user.username)
  );

  if (!isLoaded || isLoading) {
    return <Loader />;
  }

  return (
    <>
    <h3>‎ ‎ </h3>
      <h1>Your events</h1>
      <h4>All your listed events show up here</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {userTickets.length > 0 ? (
          userTickets.map((ticket) => (
            <Card
              key={ticket._id}
              hoverable
              style={{ width: 350, height: 350, position: 'relative' }}
              cover={ticket.poster ? <img alt={ticket.eventName} src={ticket.poster} height="180px" /> : null}
            >
              <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
                <Badge
                  count={
                    <div className="listing-badge">
                      <LineChartOutlined style={{ marginRight: 4, fontSize: 16 }} />
                      <span><b>{ticket.initialQuantity - ticket.remainingQuantity}</b></span>
                      <span><b> tickets sold!</b></span>
                    </div>
                  }
                  style={{ backgroundColor: '#52c41a' }}
                />
              </div>
              <Meta
                title={ticket.eventName}
                description={`Location: ${ticket.eventLocation}, Price: ₹ ${ticket.price}, Category: ${ticket.category}, Remaining Quantity: ${ticket.remainingQuantity}`}
              />
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => showEditModal(ticket._id)} type="primary">Edit</Button>
                <Button onClick={() => showDeleteModal(ticket._id)} type="danger">Delete</Button>
                <Link to={`/event/${ticket._id}`} target="_blank" rel="noopener noreferrer"><Button type="default">View Listing</Button></Link>
              </div>
            </Card>
          ))
        ) : (
          <p>You have not listed any tickets yet 🥲</p>
        )}
      </div>

      <Modal
  title="Edit Ticket"
  open={isEditModalVisible}
  onCancel={handleCancel}
  footer={null}
>
  <Form
    initialValues={editTicketData}  
    onFinish={(values) => handleEdit(selectedTicketId, values)}
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
          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="date" label="Date">
            <Input type="date" />
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

      <Divider />

      <div id="bought-tickets-section" className='bought'>
        <h1>Bought Tickets</h1>
        <h4>All tickets you have bought show up here</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {boughtTickets.length > 0 ? (
            boughtTickets
              .filter(ticket => ticket.buyerName === (user.fullName || user.username))
              .map((ticket) => (
                <Card
                  key={ticket._id}
                  hoverable
                  className="bought-ticket-card"
                  style={{ width: 350, height: 350 }}
                  cover={ticket.poster ? <img alt={ticket.eventName} src={ticket.poster} height="180px" /> : null}
                >
                  <div className="bought-info">
                    <div>
                      <span className="">Bought</span>
                    </div>
                    <div className="bought-badge ">
                      <ClockCircleFilled />
                      <span>   {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Meta
                    title={ticket.eventName}
                    description={`Location: ${ticket.location}, Price: ₹ ${ticket.totalPrice}, Category: ${ticket.category}, Quantity: ${ticket.quantity}`}
                  />
                </Card>
              ))
          ) : (
            <p>You have not bought any tickets yet 🥲</p>
          )}
        </div>
        <br />
      </div>
      
    </>
  );
};

export default Dashboard;
