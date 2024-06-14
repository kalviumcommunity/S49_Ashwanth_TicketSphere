import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './details.css';
import { Modal, Select, Alert,Button } from 'antd';
import GooglePayButton from '@google-pay/button-react';
import { ClerkProvider, RedirectToSignIn, SignIn, SignUp, SignedIn, SignedOut,Protect , useUser} from "@clerk/clerk-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const { Option } = Select;

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tickets/${id}`);
        setEvent(response.data);
      } catch (error) {
        setError('Error fetching event details.');
        console.error('Error fetching event details:', error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleContactSeller = () => {
    const sellerPhoneNumber = event.phoneNumber;
    const whatsappLink = `https://wa.me/${sellerPhoneNumber}`;
    window.open(whatsappLink, '_blank');
  };

  const handlePaymentAuthorized = async (paymentData) => {
    try {
      const transactionData = {
        eventName: event.eventName,
        sellerName: event.sellerName,
        buyerName: user.fullName,
        quantity: quantity,
        totalPrice: event.price * quantity,
      };
      await axios.post('http://localhost:3000/buys', transactionData);
  
      console.log('Transaction details saved successfully.');
      toast.success('Ticket successfully bought!', {
        autoClose: 1200, 
      });
      setIsModalVisible(false); 
      return { transactionState: 'SUCCESS' };
    } catch (error) {
      console.error('Error saving transaction details:', error);
      toast.error('Error occurred while buying ticket.', {
        autoClose: 1200, 
      });
      return { transactionState: 'ERROR' };
    }
  };

  const handleLoginModalOk = () => {
    setIsLoginModalVisible(false);
    history.push(`/sign-in?eventId=${id}`);
  };

  const showModal = () => {
    if (isSignedIn) {
      setIsModalVisible(true);
    } else {
      setIsLoginModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsLoginModalVisible(false);
  };

  const handleQuantityChange = (value) => {
    setQuantity(value);
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!event || !isLoaded) {
    return <div>Loading...</div>;
  }

  const totalPrice = (event.price * quantity).toFixed(2);

  const renderBuyButton = () => {
    if (isSignedIn) {
      return (
        <Link onClick={showModal} className="fancy buy-tickets-button">
          <span className="top-key"></span>
          <span className="text">Buy</span>
          <span className="bottom-key-1"></span>
          <span className="bottom-key-2"></span>
        </Link>
      );
    } else {
      return (
        <Link onClick={showModal} className="fancy buy-tickets-button">
          <span className="top-key"></span>
          <span className="text">Buy</span>
          <span className="bottom-key-1"></span>
          <span className="bottom-key-2"></span>
        </Link>
      );
    }
  };

  return (
    <>
    <img src={event.poster} alt="" className= "bg-image"/>
    <div className="container">
      <ToastContainer />
      <div className="event-details">
        <img src={event.poster} alt={event.eventName} className="event-image" />
        <div className="event-info">
          <h2>{event.eventName}</h2>
          <p>Location: {event.eventLocation}</p>
          <p>Category: {event.category}</p>
          <p>Price: ₹{event.price}</p>
          <p>Available Quantity: {event.quantity}</p>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p className="description">Description: {event.description}</p>
          <p className="seller">Listed by: {event.sellerName}</p>
  
          {renderBuyButton()}
  
          <Modal title="Buy Tickets" visible={isModalVisible} onCancel={handleCancel} footer={null}>
            <div>
              <label>
                Quantity:
                <Select defaultValue={quantity} onChange={handleQuantityChange} style={{ width: 120, marginLeft: 10 }}>
                  {[...Array(event.quantity).keys()].map((num) => (
                    <Option key={num + 1} value={num + 1}>
                      {num + 1}
                    </Option>
                  ))}
                </Select>
              </label>
              <p>Total Price: ₹ {totalPrice}</p>
  
              <Alert message="Please proceed with payment only if you have already spoken to the seller." type="warning" />
              <br />
  
              <GooglePayButton
                environment="TEST"
                paymentRequest={{
                  apiVersion: 2,
                  apiVersionMinor: 0,
                  allowedPaymentMethods: [
                    {
                      type: 'CARD',
                      parameters: {
                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                        allowedCardNetworks: ['MASTERCARD', 'VISA'],
                      },
                      tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                          gateway: 'example',
                          gatewayMerchantId: 'exampleGatewayMerchantId',
                        },
                      },
                    },
                  ],
                  merchantInfo: {
                    merchantId: '12345678901234567890',
                    merchantName: 'Demo Merchant',
                  },
                  transactionInfo: {
                    totalPriceStatus: 'FINAL',
                    totalPriceLabel: 'Total',
                    totalPrice: totalPrice.toString(),
                    currencyCode: 'INR',
                    countryCode: 'IN',
                  },
                  shippingAddressRequired: true,
                  callbackIntents: ['SHIPPING_ADDRESS', 'PAYMENT_AUTHORIZATION'],
                }}
                onLoadPaymentData={(paymentRequest) => {
                  console.log('Success', paymentRequest);
                }}
                onPaymentAuthorized={handlePaymentAuthorized}
                onPaymentDataChanged={(paymentData) => {
                  console.log('On Payment Data Changed', paymentData);
                  return {};
                }}
                existingPaymentMethodRequired="false"
                buttonColor="black"
                buttonType="Buy"
                className="dark-google-pay-button"
              />
            </div>
          </Modal>

          <Modal
            title="Login Required"
            open={isLoginModalVisible}
            onOk={handleLoginModalOk}
            onCancel={handleCancel}
            footer={[
              <Link to={`/sign-in?eventId=${id}`} key="login-link">
                <Button>
                  Go to Sign In
                </Button>
              </Link>,
              ]}
          >
            <p>Please log in to proceed with buying tickets.</p>            
          </Modal>
  
          <button className="contact-seller-button" onClick={handleContactSeller}>
            Talk to seller
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default EventDetails;
