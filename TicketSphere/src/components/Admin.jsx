import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Typography, Image, message } from 'antd';

const { Title } = Typography;

function Admin() {
  const [buys, setBuys] = useState([]);

  useEffect(() => {
    const fetchBuys = async () => {
      try {
        const response = await axios.get('https://ticketsphere.onrender.com/buys');
        setBuys(response.data);
      } catch (error) {
        console.error('Error fetching buy data:', error);
        message.error('Failed to fetch buy data');
      }
    };

    fetchBuys();
  }, []);

  const columns = [
    {
      title: 'Event Name',
      dataIndex: 'eventName',
      key: 'eventName',
    },
    {
      title: 'Seller Name',
      dataIndex: 'sellerName',
      key: 'sellerName',
    },
    {
      title: 'Buyer Name',
      dataIndex: 'buyerName',
      key: 'buyerName',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Poster',
      dataIndex: 'poster',
      key: 'poster',
      render: (poster, record) => (
        <Image
          width={100}
          src={poster}
          alt={record.eventName}
        />
      ),
    },
  ];

  return (
    <>
    <h4>‎ ‎ </h4>
    <div style={{ padding: '20px' }}>
      <Title level={1}>Admin View</Title>
      <Title level={2}>Transactions</Title>
      <Table
        columns={columns}
        dataSource={buys}
        rowKey="_id"
      />
    </div>
    </>
  );
}

export default Admin;
